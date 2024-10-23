function onButtonClick() {
  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice({filters: [{services: ['heart_rate']}]})
  .then(device => {
    log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    log('Getting Heart Rate Service...');
    return server.getPrimaryService('heart_rate');
  })
  .then(service => {
    log('Getting Heart Rate Control Point Characteristic...');
    return service.getCharacteristic('heart_rate_control_point');
  })
  .then(characteristic => {
    log('Writing Heart Rate Control Point Characteristic...');

    // Writing 1 is the signal to reset energy expended.
    let resetEnergyExpended = Uint8Array.of(1);
    return characteristic.writeValue(resetEnergyExpended);
  })
  .then(_ => {
    log('> Energy expended has been reset.');
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

function deviceInfo() {
    let filters = [];
  
    /*
    let filterService = document.querySelector('#service').value;
    if (filterService.startsWith('0x')) {
      filterService = parseInt(filterService);
    }
    if (filterService) {
      filters.push({services: [filterService]});
    }
    */
  
    //let filterName = document.querySelector('#name').value;
    let filterName="ESP";
    if (filterName) {
      filters.push({name: filterName});
    }
  
    //let filterNamePrefix = document.querySelector('#namePrefix').value;
    let filterNamePrefix="My";
    if (filterNamePrefix) {
      filters.push({namePrefix: filterNamePrefix});
    }
  
    let options = {};
    if (document.getElementById('checkBox').checked) {
      options.acceptAllDevices = true;
    } else {
      options.filters = filters;
    }
  
    console.log('Requesting Bluetooth Device...');
    console.log('with ' + JSON.stringify(options));
    navigator.bluetooth.requestDevice(options)
    .then(device => {
        console.log('> Name:             ' + device.name);
        console.log('> Id:               ' + device.id);
        console.log('> Connected:        ' + device.gatt.connected);
    })
    .catch(error => {
      console.log('Argh! ' + error);
    });
  }

  async function deviceInfoAsync() {
    let filters = [];
  
    let filterName="ESP";
    if (filterName) {
      filters.push({name: filterName});
    }
  
    //let filterNamePrefix = document.querySelector('#namePrefix').value;
    let filterNamePrefix="My";
    if (filterNamePrefix) {
      filters.push({namePrefix: filterNamePrefix});
    }
  
    let options = {};
    if (document.getElementById('checkBox').checked) {
      options.acceptAllDevices = true;
    } else {
      options.filters = filters;
    }
  
    try {
      log('Requesting Bluetooth Device...');
      log('with ' + JSON.stringify(options));
      const device = await navigator.bluetooth.requestDevice(options);
  
      log('> Name:             ' + device.name);
      log('> Id:               ' + device.id);
      log('> Connected:        ' + device.gatt.connected);
    } catch(error)  {
      log('Argh! ' + error);
    }
  }

  function read() {
    let filters = [];

    //let filterName = document.querySelector('#name').value;
    let filterName="ESP";
    if (filterName) {
      filters.push({name: filterName});
    }
  
    //let filterNamePrefix = document.querySelector('#namePrefix').value;
    let filterNamePrefix="My";
    if (filterNamePrefix) {
      filters.push({namePrefix: filterNamePrefix});
    }
  
    let options = {};
    if (document.getElementById('checkBox').checked) {
      options.acceptAllDevices = true;
    } else {
      options.filters = filters;
    }

    options.optionalServices=['4fafc201-1fb5-459e-8fcc-c5c9c331914b'];
  
    console.log('Requesting Bluetooth Device...');
    console.log('with ' + JSON.stringify(options));

    log('Requesting Bluetooth Device...');

    navigator.bluetooth.requestDevice(options)
    .then(device => {
        console.log('> Name:             ' + device.name);
        console.log('> Id:               ' + device.id);
        console.log('> Connected:        ' + device.gatt.connected);
    })
    .then(device => {
      log('Connecting to GATT Server...');
      return device.gatt.connect();
    })
    .then(server => {
      log('Getting Battery Service...');
      return server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b');
    })
    .then(service => {
      log('Getting Battery Level Characteristic...');
      return service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');
    })
    .then(characteristic => {
      log('Reading Battery Level...');
      return characteristic.readValue();
    })
    .then(value => {
      let batteryLevel = value.getUint8(0);
      log('> Battery Level is ' + batteryLevel + '%');
    })
    .catch(error => {
      log('Argh! ' + error);
    });
  }

  async function readAsync() {

    try {
      log('Requesting Bluetooth Device...');
      //https://webbluetoothcg.github.io/web-bluetooth/#dom-requestdeviceoptions-optionalservices
      const device = await navigator.bluetooth.requestDevice({
          filters: [{name: ['MyESP32']},{namePrefix:['My']}],
          optionalServices:['4fafc201-1fb5-459e-8fcc-c5c9c331914b']
        });
  
      log('Connecting to GATT Server...');
      const server = await device.gatt.connect();
  
      log('Getting Battery Service...');
      const service = await server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b');
  
      log('Getting Battery Level Characteristic...');
      const characteristic = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');
  
      log('Reading Battery Level...');
      const value = await characteristic.readValue();
        //value is DataView
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView

      log('> Battery Level is ' + value.getUint8(0) + '%');

      var enc = new TextDecoder();

      log('> Battery Level is ' + enc.decode(value) + ':txt');
    } catch(error) {
      log('Argh! ' + error);
    }
  }

  async function writeAsync() {

    try {
      log('Requesting Bluetooth Device...');
      //https://webbluetoothcg.github.io/web-bluetooth/#dom-requestdeviceoptions-optionalservices
      const device = await navigator.bluetooth.requestDevice({
          filters: [{name: ['MyESP32']},{namePrefix:['My']}],
          optionalServices:['4fafc201-1fb5-459e-8fcc-c5c9c331914b']
        });
  
      log('Connecting to GATT Server...');
      const server = await device.gatt.connect();
  
      log('Getting Battery Service...');
      const service = await server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b');
  
      log('Getting Battery Level Characteristic...');
      const characteristic = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');
  
      log('Reading Battery Level...');
      const value = await characteristic.readValue();
        //value is DataView
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView

      log('> Battery Level is ' + value.getUint8(0) + '%');

      var enc = new TextDecoder();

      log('> Battery Level is ' + enc.decode(value) + ':txt');

      //let message = Uint8Array.of(1);
      let message = new Uint8Array([2,4,8,16,32,64]);
        await characteristic.writeValue(message);

    } catch(error) {
      log('Argh! ' + error);
    }
  }

  var characteristic;
  var r,g,b,w;
  var rElem,gElem,bElem,wElem;
  const fps = 15;
  //var isSent = true;

  function setup(){
        console.log("Setup")
        frameRate(fps);

        rElem = document.getElementById('r'); // input要素
        rElem.addEventListener('input', onR,false); 
        gElem = document.getElementById('g'); // input要素
        gElem.addEventListener('input', onG,false); 
        bElem = document.getElementById('b'); // input要素
        bElem.addEventListener('input', onB,false); 
        wElem = document.getElementById('w'); // input要素
        wElem.addEventListener('input', onW,false); 
    }

    function draw(){
        console.log("Draw");
        /*
        if(isSent == true){
            isSent = false;
            send(r,g,b,w);
        }
        */
        send(r,g,b,w);
        
        /*
        const data = new Uint8Array([r, g, b, w]); // hello
        //await writer.write(data);
        if(writer!=null){
            writer.write(data);
        }
        */
    }

    const onR = (e) =>{
        r= parseInt(e.target.value);
    }

    const onG = (e) =>{
        g= parseInt(e.target.value);
    }

    const onB = (e) =>{
        b= parseInt(e.target.value);
    }

    const onW = (e) =>{
        w= parseInt(e.target.value);
    }

  async function connect() {

    try {
      log('Requesting Bluetooth Device...');
      //https://webbluetoothcg.github.io/web-bluetooth/#dom-requestdeviceoptions-optionalservices
      
      /*
      const device = await navigator.bluetooth.requestDevice({
          filters: [{name: ['MyESP32']},{namePrefix:['My']}],
          optionalServices:['4fafc201-1fb5-459e-8fcc-c5c9c331914b']
        });
        */

        let options = {};
        options.acceptAllDevices = true;

        /*
        if (document.getElementById('checkBox').checked) {
          options.acceptAllDevices = true;
        } else {
          options.filters = filters;
        }
        */
    
        options.optionalServices=['4fafc201-1fb5-459e-8fcc-c5c9c331914b'];

        const device = await navigator.bluetooth.requestDevice(options);
  
      log('Connecting to GATT Server...');
      const server = await device.gatt.connect();
  
      log('Getting Battery Service...');
      const service = await server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b');
  
      log('Getting Battery Level Characteristic...');
      //const characteristic = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');
      characteristic = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');
  
      log('Reading Battery Level...');
      const value = await characteristic.readValue();
        //value is DataView
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView

      log('> Battery Level is ' + value.getUint8(0) + '%');

      var enc = new TextDecoder();

      log('> Battery Level is ' + enc.decode(value) + ':txt');

      //let message = Uint8Array.of(1);
      let message = new Uint8Array([2,4,8,16,32,64]);
        await characteristic.writeValue(message);

    } catch(error) {
      log('Argh! ' + error);
    }
  }

  function log(msg){
    console.log(msg);
  }

  async function send(r,g,b,w){
    if(characteristic!=undefined){
        let message = new Uint8Array([r,g,b,w]);
        try {
            await characteristic.writeValue(message);
          } catch (error) {
            log('Argh! ' + error);
          }
        
    }
  }