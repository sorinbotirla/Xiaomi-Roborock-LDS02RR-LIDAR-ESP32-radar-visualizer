# Xiaomi-Roborock-LDS02RR-LIDAR-ESP32-radar-visualizer
View realtime radar scan of the Xiaomi Roborock Vacuum LDS02RR LIDAR directly in a web page, without any libraries
<br />

### The web app demo
<a href="https://github.com/sorinbotirla/Xiaomi-Roborock-LDS02RR-LIDAR-ESP32-radar-visualizer/raw/refs/heads/main/images/Recording%202025-11-01%20152211.mp4">Demo Video</a>

### The Xiaomi LIDAR Connector Pinout
<img src="https://raw.githubusercontent.com/sorinbotirla/Xiaomi-Roborock-LDS02RR-LIDAR-ESP32-radar-visualizer/refs/heads/main/images/4995303790.jpg" width="100%" />

### The ESP32 to LIDAR adapter schematic
You'll need to build this adapter to drive the motor speed properly.
<img src="https://raw.githubusercontent.com/sorinbotirla/Xiaomi-Roborock-LDS02RR-LIDAR-ESP32-radar-visualizer/refs/heads/main/images/LDS02RR_adapter_v03_schematic.png" width="100%" />

### The wiring diagram
Notice that ESP32 is connecting to the LIDAR trough the adapter built from the previous circuit. Do not connect ESP32 directly to the LIDAR.
<img src="https://raw.githubusercontent.com/sorinbotirla/Xiaomi-Roborock-LDS02RR-LIDAR-ESP32-radar-visualizer/refs/heads/main/images/4882373974.png" width="100%" />

### BOM (Parts needed)
NOTE: The resistors are not showing in the "The ESP32 to LIDAR adapter schematic", I will add updated images. Until then, the 10k ohm resistor is connected between transistor drain and ground (in parallel), the 220 ohm resistor is connected between transistor gate and mot_en (in series). The 10k resistor pulls down remaining current, allowing the motor to stop on STOP command, the 220 ohm reistor filters a little noise.
<ul>
  <li>1x Xiaomi Roborock Vacuum LDS02RR LIDAR</li>
  <li>1x ESP32 (I used an S3 dev board)</li>
  <li>1x N-Mosfet IRLZ44N Transistor</li>
  <li>1x Schottky Diode 1n5819</li>
  <li>1x 10k Ohm Resistor</li>
  <li>1x 220 Ohm Resistor</li>
  <li>1x 10uF Ceramic Capacitor</li>
  <li>A small punch-hole breadboard or prototyping soldering board</li>
  <li>2x JST Connectors 4PINs (for the ESP32 and the LIDAR)</li>
  <li>1x JST Connectors 2PINs (for the 5V external Power Supply)</li>
  <li>Thin wire</li>
  <li>Solder Iron</li>
  <li>Solder wire</li>
</ul>
<br />
I will add more images later.
<br />
<br />
Flash the ino file on your esp32, follow the diagram for wiring and set up the files on the webapp folder on your web server.
Connect trough a serial port and view the scaning in real time.
