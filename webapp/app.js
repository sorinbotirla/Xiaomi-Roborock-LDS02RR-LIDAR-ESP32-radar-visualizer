var LIDAR = function() {
    var _self = this,
        $body = $("body");
    _self.waiters = {};
    _self.repeaters = {};
    _self.ctx = null;
    _self.canvas = null;
    _self.gridCanvas = null;
    _self.gridCtx = null;
    _self.consoleLines = [];
    _self.baudRate = 115200;
    _self.port = null;
    _self.reader = null;
    _self.writer = null;
    _self.keepReading = false;
    _self.points = [];
    _self.drawMode = "dots";
    _self.history = {};
    _self.historyDepth = 8;
    _self.stabilityThreshold = 150;
    _self.loggingEnabled = true;
    _self.defaultSpeed = 110;
    _self.zoom = 1.0;
    _self.noiseFilter = false;
    _self.noiseFilterStrength = 50;

    _self.log = function(text) {
        _self.consoleLines.push(text);
        if (_self.consoleLines.length > 11) {
            _self.consoleLines.shift();
        }
        $("#console").html(_self.consoleLines.join("\n"));
        var c = $("#console");
        c.scrollTop(c.prop("scrollHeight"));
    };

    _self.initCanvas = function() {
        _self.canvas = document.getElementById("lidarCanvas");
        _self.ctx = _self.canvas.getContext("2d");
        _self.gridCanvas = document.createElement("canvas");
        _self.gridCtx = _self.gridCanvas.getContext("2d");
        _self.resizeCanvas();
        window.addEventListener("resize", _self.resizeCanvas);
        _self.clearCanvas();
        _self.drawGrid();
    };

    _self.resizeCanvas = function() {
        var w = _self.canvas.clientWidth,
            h = _self.canvas.clientHeight;
        _self.canvas.width = w;
        _self.canvas.height = h;
        _self.gridCanvas.width = w;
        _self.gridCanvas.height = h;
        _self.drawGrid();
    };

    _self.clearCanvas = function() {
        _self.ctx.fillStyle = "black";
        _self.ctx.fillRect(0, 0, _self.canvas.width, _self.canvas.height);
    };

    _self.drawGrid = function() {
        var ctx = _self.gridCtx,
            w = _self.gridCanvas.width,
            h = _self.gridCanvas.height,
            cx = w / 2,
            cy = h / 2;

        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = "#033";
        ctx.lineWidth = 1;

        for (var r = 1000; r <= 6000; r += 1000) {
            ctx.beginPath();
            ctx.arc(cx, cy, r * Math.min(w, h) / 6000 * _self.zoom, 0, 2 * Math.PI);
            ctx.stroke();
        }

        for (var a = 0; a < 360; a += 45) {
            var rad = a * Math.PI / 180.0;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(
                cx + Math.cos(rad) * (Math.min(w, h) / 2) * _self.zoom,
                cy + Math.sin(rad) * (Math.min(w, h) / 2) * _self.zoom
            );
            ctx.stroke();
        }
    };

    _self.startScan = function() {
        _self.log("Starting scan...");
        _self.clearCanvas();
        _self.ctx.drawImage(_self.gridCanvas, 0, 0);
        var angle = 0;

        if ("undefined" != typeof _self.repeaters.scan) {
            clearInterval(_self.repeaters.scan);
        }
        _self.repeaters.scan = setInterval(function() {
            var dist = 1000 + 3000 * Math.abs(Math.sin(angle * Math.PI / 180));
            _self.drawPoint(angle, dist);
            angle += 2;
            if (angle >= 360) {
                angle = 0;
            }
        }, 360);
    };

    _self.stopScan = function() {
        _self.log("Stopping scan...");
        if (_self.repeaters.scan) {
            clearInterval(_self.repeaters.scan);
            delete _self.repeaters.scan;
        }
    };

    _self.drawPoint = function(angle, dist) {
        var ctx = _self.ctx,
            w = _self.canvas.width,
            h = _self.canvas.height,
            cx = w / 2,
            cy = h / 2,
            scale = Math.min(w, h) / 6000 * _self.zoom,
            r = dist * scale,
            rad = (angle - 90) * Math.PI / 180.0,
            x = cx + r * Math.cos(rad),
            y = cy + r * Math.sin(rad);
        ctx.fillStyle = "#0ff";
        ctx.fillRect(x, y, 2, 2);
    };

    _self.connectSerial = async function() {
        try {
            _self.port = await navigator.serial.requestPort();
            await _self.port.open({ baudRate: _self.baudRate });
            _self.log("Serial port connected.");
            _self.keepReading = true;
            _self.readSerialLoop();
        } catch (err) {
            _self.log("Serial connection failed: " + err);
        }
    };

    _self.disconnectSerial = async function() {
        _self.keepReading = false;
        if (_self.reader) {
            try {
                await _self.reader.cancel();
            } catch (e) {}
            _self.reader = null;
        }
        if (_self.port) {
            try {
                await _self.port.close();
            } catch (e) {}
            _self.port = null;
        }
        _self.log("Serial port disconnected.");
    };

    _self.sendCommand = async function(cmd) {
        if (!_self.port || !_self.port.writable) {
            _self.log("Not connected to a serial device.");
            return;
        }
        var writer = _self.port.writable.getWriter(),
            data = new TextEncoder().encode(cmd + "\n");
        await writer.write(data);
        writer.releaseLock();
        _self.log("→ " + cmd);
    };

    _self.readSerialLoop = async function() {
        while (_self.port && _self.port.readable && _self.keepReading) {
            _self.reader = _self.port.readable.getReader();
            try {
                while (true) {
                    var res = await _self.reader.read(),
                        value = res.value,
                        done = res.done;
                    if (done) {
                        break;
                    }
                    if (value) {
                        var text = new TextDecoder().decode(value);
                        _self.handleSerialData(text);
                    }
                }
            } catch (error) {
                _self.log("Read error: " + error);
            } finally {
                _self.reader.releaseLock();
            }
        }
    };

    _self.handleSerialData = function(text) {
        /* packet structure
        angle, distance
        248.0,2699
        249.0,2813
        250.0,2936
        251.0,3070
        252.0,3228
        253.0,3372
        254.0,3236
        255.0,3230
        256.0,3337
        271.0,5417
        272.0,5380
        273.0,5486
        274.0,5492

         */
        var lines = text.split(/\r?\n/),
            newPoints = [],
            i,
            line,
            parts,
            angle,
            dist;

        for (i = 0; i < lines.length; i++) {
            line = lines[i];
            if (!line.trim()) {
                continue;
            }
            if (line.startsWith("#")) {
                continue;
            }
            parts = line.split(",");
            if (parts.length !== 2) {
                continue;
            }
            angle = parseFloat(parts[0]);
            dist = parseInt(parts[1]);
            if (isNaN(angle) || isNaN(dist)) {
                continue;
            }
            newPoints.push({ angle: angle, dist: dist });
        }

        Array.prototype.push.apply(_self.points, newPoints);
        if (_self.points.length > 1000) {
            _self.points.splice(0, _self.points.length - 1000);
        }

        if (_self.loggingEnabled) {
            if (!_self.lastLogTime || Date.now() - _self.lastLogTime > 200) {
                _self.log("# Received " + newPoints.length + " pts (total " + _self.points.length + ")");
                _self.lastLogTime = Date.now();
            }
        }

        if (!_self.waiters.draw) {
            _self.waiters.draw = true;
            requestAnimationFrame(function() {
                _self.renderPoints();
                _self.waiters.draw = false;
            });
        }
    };

    _self.renderPoints = function() {
        var ctx = _self.ctx;
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.4;
        ctx.fillRect(0, 0, _self.canvas.width, _self.canvas.height);
        ctx.globalAlpha = 1.0;
        ctx.drawImage(_self.gridCanvas, 0, 0);

        var w = _self.canvas.width,
            h = _self.canvas.height,
            cx = w / 2,
            cy = h / 2,
            scale = Math.min(w, h) / 6000 * _self.zoom,
            smoothed = [],
            bin = {},
            i,
            p,
            aKey;

        for (i = 0; i < _self.points.length; i++) {
            p = _self.points[i];
            aKey = Math.round(p.angle);
            if (!bin[aKey]) {
                bin[aKey] = [];
            }
            bin[aKey].push(p.dist);
        }

        for (aKey in bin) {
            var vals = bin[aKey],
                median;
            if (vals.length === 0) {
                continue;
            }
            vals.sort(function(a, b) { return a - b; });
            median = vals[Math.floor(vals.length / 2)];
            smoothed.push({ angle: parseFloat(aKey), dist: median });
        }

        var sorted = smoothed.sort(function(a, b) { return a.angle - b.angle; });

        function polarToXY(a, d) {
            var r = d * scale,
                rad = (a - 90) * Math.PI / 180.0;
            return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
        }

        if (_self.drawMode === "lines") {
            var linePoints = sorted;
            if (_self.noiseFilter) {
                var filtered = [],
                    strength = _self.noiseFilterStrength / 100,
                    maxGap = 400 - strength * 300,
                    angleStep = 4;

                for (i = 0; i < sorted.length; i++) {
                    p = sorted[i];
                    var prev = sorted[i - 1],
                        next = sorted[i + 1];
                    if (!prev || !next) {
                        continue;
                    }

                    var diffPrev = Math.abs(p.dist - prev.dist),
                        diffNext = Math.abs(p.dist - next.dist),
                        gapPrev = Math.abs(p.angle - prev.angle),
                        gapNext = Math.abs(next.angle - p.angle),
                        consistent = (gapPrev <= angleStep && diffPrev < maxGap) || (gapNext <= angleStep && diffNext < maxGap);

                    if (consistent) {
                        filtered.push(p);
                    }
                }
                linePoints = filtered;
            }

            var minD = 100,
                maxD = 6000,
                angleThreshold = 5,
                distThreshold = 300,
                relJump = 0.2,
                prevPoint = null,
                relDiff,
                angleGap,
                distGap,
                dClamped,
                t,
                hue,
                point;

            ctx.lineWidth = 1.5;
            var prev = null;

            for (i = 0; i < linePoints.length; i++) {
                p = linePoints[i];
                if (p.dist > 6000 || p.dist < 50) {
                    continue;
                }
                point = polarToXY(p.angle, p.dist);
                if (!prev) {
                    prev = p;
                    prevPoint = point;
                    continue;
                }

                angleGap = Math.abs(p.angle - prev.angle);
                distGap = Math.abs(p.dist - prev.dist);
                relDiff = distGap / Math.max(p.dist, prev.dist);
                dClamped = Math.min(Math.max(p.dist, minD), maxD);
                t = (dClamped - minD) / (maxD - minD);
                hue = t * 240;
                ctx.strokeStyle = "hsl(" + hue + ", 100%, 50%)";

                if (angleGap > angleThreshold || distGap > distThreshold || relDiff > relJump) {
                    prev = p;
                    prevPoint = point;
                    continue;
                }

                ctx.beginPath();
                ctx.moveTo(prevPoint.x, prevPoint.y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();

                prev = p;
                prevPoint = point;
            }
        } else {
            var minD2 = 100,
                maxD2 = 6000,
                pixelPoints = [],
                r,
                rad,
                x,
                y,
                dClamped2,
                t2,
                hue2,
                color,
                toDraw,
                strength2,
                radius,
                minNeighbors,
                r2,
                filtered2,
                j,
                pi,
                neighbors,
                dx,
                dy,
                p2;

            for (i = 0; i < sorted.length; i++) {
                p = sorted[i];
                r = p.dist * scale;
                rad = (p.angle - 90) * Math.PI / 180.0;
                x = cx + r * Math.cos(rad);
                y = cy + r * Math.sin(rad);
                dClamped2 = Math.min(Math.max(p.dist, minD2), maxD2);
                t2 = (dClamped2 - minD2) / (maxD2 - minD2);
                hue2 = t2 * 240;
                color = "hsl(" + hue2 + ", 100%, 50%)";
                pixelPoints.push({ x: x, y: y, color: color });
            }

            toDraw = pixelPoints;
            if (_self.noiseFilter) {
                strength2 = _self.noiseFilterStrength / 100;
                radius = 6 + strength2 * 10;
                minNeighbors = 1 + Math.round(strength2 * 3);
                r2 = radius * radius;
                filtered2 = [];

                for (i = 0; i < pixelPoints.length; i++) {
                    pi = pixelPoints[i];
                    neighbors = 0;
                    for (j = Math.max(0, i - 8); j < Math.min(pixelPoints.length, i + 8); j++) {
                        if (i === j) {
                            continue;
                        }
                        dx = pixelPoints[j].x - pi.x;
                        dy = pixelPoints[j].y - pi.y;
                        if (dx * dx + dy * dy < r2) {
                            neighbors++;
                        }
                        if (neighbors >= minNeighbors) {
                            break;
                        }
                    }
                    if (neighbors >= minNeighbors) {
                        filtered2.push(pi);
                    }
                }
                toDraw = filtered2;
            }

            for (i = 0; i < toDraw.length; i++) {
                p2 = toDraw[i];
                ctx.fillStyle = p2.color;
                ctx.fillRect(p2.x, p2.y, 2, 2);
            }
        }

        if (_self.points.length > 360) {
            _self.points.splice(0, _self.points.length - 360);
        }
    };

    _self.setDefaults = function() {
        if (!!localStorage.getItem("defaultSpeed") && !isNaN(localStorage.getItem("defaultSpeed"))) {
            _self.defaultSpeed = parseFloat(localStorage.getItem("defaultSpeed"));
            $("#motorSpeed").val(_self.defaultSpeed).change();
            $("#speedValue").text(_self.defaultSpeed);
        }
        if (!!localStorage.getItem("defaultZoom") && !isNaN(localStorage.getItem("defaultZoom"))) {
            _self.zoom = parseFloat(localStorage.getItem("defaultZoom"));
            $("#zoomSlider").val(_self.zoom).change();
            $("#zoomValue").text(_self.zoom);
        }
        if (!!localStorage.getItem("defaultNoiseFilterStrength") && !isNaN(localStorage.getItem("defaultNoiseFilterStrength"))) {
            _self.noiseFilterStrength = parseInt(localStorage.getItem("defaultNoiseFilterStrength"));
            $("#noiseFilterStrength").val(_self.noiseFilterStrength).change();
            $("#noiseFilterStrengthValue").text(_self.noiseFilterStrength);
        }
    };

    _self.handleEvents = function() {
        $body.on("click", "#btnConnect", function() {
            if (_self.port) {
                _self.disconnectSerial();
                $("#btnConnect").text("Connect Serial");
            } else {
                _self.connectSerial();
                $("#btnConnect").text("Disconnect");
            }
        });

        $body.on("click", "#btnStart", async function() {
            if (_self.port) {
                await _self.sendCommand("START");
                _self.log("Start command sent.");
                await new Promise(function(r) { setTimeout(r, 200); });
                await _self.sendCommand("SPEED" + _self.defaultSpeed);
                _self.log("Default speed (" + _self.defaultSpeed + ") applied on start.");
            } else {
                _self.startScan();
            }
        });

        $body.on("click", "#btnStop", async function() {
            if (_self.port) {
                await _self.sendCommand("STOP");
                _self.log("Stop command sent.");
            } else {
                _self.stopScan();
            }
        });

        $body.on("click", "#btnToggleDrawMode", function() {
            _self.drawMode = _self.drawMode === "dots" ? "lines" : "dots";
            $(this).text("Show " + (_self.drawMode === "dots" ? "lines" : "dots"));
            _self.log("Switched to " + _self.drawMode + " mode.");
        });

        $body.on("click", "#toggleLogBtn", function() {
            _self.loggingEnabled = !_self.loggingEnabled;
            var label = _self.loggingEnabled ? "Disable Log" : "Enable Log";
            $(this).text(label);
            _self.log("# Serial logging " + (_self.loggingEnabled ? "enabled" : "disabled") + ".");
        });

        $body.off("input.setSpeed", "#motorSpeed").on("input.setSpeed", "#motorSpeed", function() {
            $("#speedValue").text($(this).val());
        });

        $body.on("click", "#btnSetSpeed", async function() {
            var speedSlider = $("#motorSpeed"),
                val = speedSlider.val();
            _self.defaultSpeed = parseFloat(val);
            localStorage.setItem("defaultSpeed", _self.defaultSpeed);
            if (_self.port) {
                await _self.sendCommand("SPEED" + val);
                _self.log("Motor speed set to " + val);
            } else {
                _self.log("(offline) Motor speed adjusted to " + val);
            }
        });

        $body.on("input", "#zoomSlider", function() {
            _self.zoom = parseFloat($(this).val());
            $("body").find("#zoomValue").text(_self.zoom.toFixed(1) + "×");
            localStorage.setItem("defaultZoom", parseFloat(_self.zoom));
            _self.drawGrid();
            _self.renderPoints();
        });

        $body.on("click", "#btnFilter", function() {
            _self.noiseFilter = !_self.noiseFilter;
            var label = _self.noiseFilter ? "Show Raw" : "Filter Noise";
            $(this).text(label);
            _self.log("# Noise Filter " + (_self.noiseFilter ? "ON" : "OFF"));
        });

        $body.on("input", "#noiseFilterStrength", function() {
            var val = parseInt($(this).val());
            _self.noiseFilterStrength = val;
            $("#noiseFilterStrengthValue").text(val);
            localStorage.setItem("defaultNoiseFilterStrength", val);
            _self.log("# Filter strength set to " + val);
            _self.renderPoints();
        });

        _self.canvas.addEventListener("wheel", function(e) {
            e.preventDefault();
            var zoomSlider = $("#zoomSlider"),
                min = parseFloat(zoomSlider.attr("min") || 0.1),
                max = parseFloat(zoomSlider.attr("max") || 5),
                step = parseFloat(zoomSlider.attr("step") || 0.1),
                delta = e.deltaY < 0 ? step : -step,
                newZoom = _self.zoom + delta;

            if (newZoom < min) {
                newZoom = min;
            } else if (newZoom > max) {
                newZoom = max;
            }

            _self.zoom = parseFloat(newZoom.toFixed(2));
            zoomSlider.val(_self.zoom).trigger("input");
        }, { passive: false });
    };

    _self.init = function() {
        _self.log("LIDAR UI ready.");
        _self.setDefaults();
        _self.initCanvas();
        _self.handleEvents();
    };
};

window.LIDAR = new LIDAR();
$(window).on("load", function() {
    window.LIDAR.init();
});
