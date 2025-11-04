# Xiaomi-Roborock-LDS02RR-LIDAR-ESP32-radar-visualizer
View realtime radar scan of the Xiaomi Roborock Vacuum LDS02RR LIDAR directly in a web page, without any libraries
<table>
  <tr>
    <td width="33%" valign="top">
      <img src="https://raw.githubusercontent.com/sorinbotirla/Xiaomi-Roborock-LDS02RR-LIDAR-ESP32-radar-visualizer/refs/heads/main/images/4882382751.jpg" />
      The LDS02RR Xiaomi Roborock Lidar
    </td>
    <td width="67%" valign="top">
      <img src="https://raw.githubusercontent.com/sorinbotirla/Xiaomi-Roborock-LDS02RR-LIDAR-ESP32-radar-visualizer/refs/heads/main/images/ui.jpg" />
      The Web App UI
    </td>
  </tr>
</table>

### The web app demo
<a href="https://www.youtube.com/watch?v=WUuwncnQbW0" target="_blank">Demo Video on YouTube</a>

### The Xiaomi LIDAR Connector Pinout
<img src="https://raw.githubusercontent.com/sorinbotirla/Xiaomi-Roborock-LDS02RR-LIDAR-ESP32-radar-visualizer/refs/heads/main/images/1024px-Pinout.png" width="100%" />

### The wiring diagram
<img src="https://raw.githubusercontent.com/sorinbotirla/Xiaomi-Roborock-LDS02RR-LIDAR-ESP32-radar-visualizer/refs/heads/main/images/schematic.png" width="100%" />

### BOM (Parts needed)
<ul>
  <li>1x Xiaomi Roborock Vacuum LDS02RR LIDAR (the sensor)</li>
  <li>1x ESP32 (I used an S3 dev board) (can be any esp32 board)</li>
  <li>1x N-Mosfet IRLZ44N Transistor (adjusts the motor speed)</li>
  <li>1x Schottky Diode 1n5819 (schottky preffered)</li>
  <li>1x 10k Ohm Resistor (stops the motor when the STOP command is sent)</li>
  <li>1x 220 Ohm Resistor (filters some noise)</li>
  <li>1x 10uF Ceramic Capacitor (helps with the motor start)</li>
  <li>A small punch-hole breadboard or prototyping soldering board (for the components soldering)</li>
  <li>2x JST Connectors 4PINs (for the ESP32 and the LIDAR) (if you want to plug and unplug it fast)</li>
  <li>1x JST Connector 2PINs (for the 5V external Power Supply)</li>
  <li>Thin wire (to connect the components)</li>
  <li>Solder Iron (do not overheat the components with it)</li>
  <li>Solder wire (for soldering)</li>
</ul>

### Setting up and running
Flash the <a href="https://github.com/sorinbotirla/Xiaomi-Roborock-LDS02RR-LIDAR-ESP32-radar-visualizer/blob/main/esp32-xiaomi-lidar-lds02rr.ino">esp32-xiaomi-lidar-lds02rr.ino</a> file on your esp32, follow the diagram for wiring and set up the files from the webapp folder on your web server.
Connect trough a serial port and view the scaning in real time.

### The Web App
Open the <a href="https://github.com/sorinbotirla/Xiaomi-Roborock-LDS02RR-LIDAR-ESP32-radar-visualizer/blob/main/webapp/index.html">web app pagee</a> in your browser (not directly, but served by a webserver - local or online). The buttons and controlls you get are:
<ul>
  <li>Connect Serial (will open the connected devices popup to select your ESP32)</li>
  <li>Start Scan (will start spinning the motor and get the scan data on the radar map)</li>
  <li>Stop Scan (will stop spinning the motor)</li>
  <li>Show Lines (will show lines instead of dots on the radar map)</li>
  <li>Disable log (will stop the log adding new messages)</li>
  <li>Motor Speed (changes the value of the motor speed, but it doesn't change the motor speed yet)</li>
  <li>Set (changes the speed of the motor to the value set above)</li>
  <li>Zoom (also work with the mouse wheel above the radar map)</li>
  <li>Filter Noise (cleans up the radar map)</li>
  <li>Filter Strength (adjusts the noise filter strength)</li>
</ul>

### Troubleshooting
#### The ESP32 Is not detected by the browser
Connect an USB-C to USB-A cable (not USB-C to USB-C). Try the other USB-C connector of the ESP32. if it has 2 USB-C ports. Make sure your web app is opened from a local server or an online server, do not open the html directly in the browser.

#### The LIDAR Motor hums but does not spin
Try increasing the motor speed slider and click the speed set button.

#### The LIDAR Motor spins but it doesn't show any data on the radar
Make sure you connected the TX wire. If you want to debug the packets, disconnect the ESP32 then connect a Serial TTL Interface (CP2101 or CH340) to GND/5V/TX pins of your LIDAR (LIDAR TX to interface RX). Open Putty or Arduino IDE Console Terminal. Set the baudrate to 115200. If packets are shown, you're good to go. If no packets are show, set the baudrate to 230400. If packets are shown, you will need to change the LIDAR baud rate from the esp32 code to 230400 and flash your esp32 again (some newer or older models use 115200 while the other use 230400 baud rates). 

#### The ESP32 is not detected in Arduino IDE.
Make sure you configured Arduino IDE for ESP32. If not,

##### 1. Add ESP32 json files
Add the following URLs to Additional Boards Manager URLs:<br />
> https://dl.espressif.com/dl/package_esp32_index.json<br />
> https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_dev_index.json

##### 2. Install ESP32 support for Arduino IDE
Go to Tools>Board>Boards Manager, search for esp32 and install esp32 by Espressif Systems (<strong>VERSION 2.0.10</strong>)<br />

NOTE: If you're using windows<br />
Install the [CP210X Drivers](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers)<br />
Install the [CH340X Drivers](https://github.com/justcallmekoko/ESP32Marauder/blob/master/Drivers/CH34x_Install_Windows_v3_4.EXE)<br />


##### 3. (optional) Edit platforms.txt
With any text editor, open platform.txt file which is located on:<br />
> Windows: C:\Users\USERNAME\AppData\Local\Arduino15\packages\esp32\hardware\esp32\2.0.10\platform.txt<br />
> Linux or Mac: /home/USERNAME/.arduino15/packages/esp32/hardware/esp32/2.0.10/platform.txt<br />

(replace USERNAME with your username)<br />
