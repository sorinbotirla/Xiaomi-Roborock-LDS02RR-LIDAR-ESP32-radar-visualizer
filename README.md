# Xiaomi-Roborock-LDS02RR-LIDAR-ESP32-radar-visualizer
View realtime radar scan of the Xiaomi Roborock Vacuum LDS02RR LIDAR directly in a web page, without any libraries
<table>
  <tr>
    <td witdh="50%">
      <img src="https://raw.githubusercontent.com/sorinbotirla/Xiaomi-Roborock-LDS02RR-LIDAR-ESP32-radar-visualizer/refs/heads/main/images/4882382751.jpg" width="100%" />
    </td>
    <td witdh="50%">
      <img src="https://raw.githubusercontent.com/sorinbotirla/Xiaomi-Roborock-LDS02RR-LIDAR-ESP32-radar-visualizer/refs/heads/main/images/ui.jpg" width="100%" />
    </td>
  </tr>
</table>
<br />

### The web app demo
<a href="https://www.youtube.com/watch?v=WUuwncnQbW0" target="_blank">Demo Video on YouTube</a>

### The Xiaomi LIDAR Connector Pinout
<img src="https://raw.githubusercontent.com/sorinbotirla/Xiaomi-Roborock-LDS02RR-LIDAR-ESP32-radar-visualizer/refs/heads/main/images/4995303790.jpg" width="100%" />

### The wiring diagram
<img src="https://raw.githubusercontent.com/sorinbotirla/Xiaomi-Roborock-LDS02RR-LIDAR-ESP32-radar-visualizer/refs/heads/main/images/schematic.png" width="100%" />
<img src="https://raw.githubusercontent.com/sorinbotirla/Xiaomi-Roborock-LDS02RR-LIDAR-ESP32-radar-visualizer/refs/heads/main/images/LDS02RR_adapter_v03_schematic.png" width="100%" />

### BOM (Parts needed)
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
<br />
<br />
Flash the ino file on your esp32, follow the diagram for wiring and set up the files on the webapp folder on your web server.
Connect trough a serial port and view the scaning in real time.
