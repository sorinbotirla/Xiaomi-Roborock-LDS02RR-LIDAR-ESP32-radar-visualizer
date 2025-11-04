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
Flash the ino file on your esp32, follow the diagram for wiring and set up the files from the webapp folder on your web server.
Connect trough a serial port and view the scaning in real time.

### The Web App
Open the web app html file in your browser. The buttons and controlls you get are:
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
