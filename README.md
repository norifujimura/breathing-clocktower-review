# breathing-clocktower-review
Partial copy of of the repo 'breathing-clocktower' for code review of the artwork 'Breathing Clocktower'
Javascript(Web-app for Chrome to Record and Edit waveforms, WebSerial), Python+pygames+BLE for Visualization and LED control for Raspberry PI, Arduino code for M5Stack ATOM(ESP32 base micro processor) to drive 24*1m LED strips.

* M5stack breath waveform recorder (sensor part) in Arduino
* JS waveform recorder (recorder part) in JS. Shall be used in Chrome to make WebSerial work
* JS waveform editor in JS.
* Python script to run the art installation. 1)Besides python, install pygame with 'pip install pygame' 2)To start the app, go to the script's directory and 'python breathing-clocktower.py'
* M5stack Arduino code to receive waveform LED data via BLE from python app
* 
<img src = "./doc-images/overview1.png" width = "600">
<img src = "./doc-images/overview2.png" width = "600">

## Experience
<img src = "./doc-images/experience.png" width = "800">

## Architecture
<img src = "./doc-images/architecture-breathing-clocktower.jpg" width = "800">
