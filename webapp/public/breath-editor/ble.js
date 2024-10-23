
  var characteristicOne,characteristicTwo;
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
        send(true,r,g,b,w);
        send(false,r,g,b,w);
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

  async function connect(isOne) {

    try {
      log('Requesting Bluetooth Device...');
      //https://webbluetoothcg.github.io/web-bluetooth/#dom-requestdeviceoptions-optionalservices
      
      let options = {};
      options.acceptAllDevices = true;

      options.optionalServices=['4fafc201-1fb5-459e-8fcc-c5c9c331914b'];

      const device = await navigator.bluetooth.requestDevice(options);
  
      log('Connecting to GATT Server...');
      const server = await device.gatt.connect();
  
      log('Getting Service...');
      const service = await server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b');
  
      log('Getting Characteristic...');
      //const characteristic = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');
      if(isOne){
        characteristicOne = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');
      }else{
        characteristicTwo = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');
      }
  
      log('Reading Message');
      var value;
      if(isOne){
        characteristicOne = await characteristic.readValue();
      }else{
        characteristicTwo = await characteristic.readValue();
      }
        //value is DataView
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView

      var enc = new TextDecoder();

      log('> Message is ' + enc.decode(value) + ':txt');

      //let message = Uint8Array.of(1);
      let message = new Uint8Array([2,4,8,16,32,64]);
      if(isOne){
        await characteristicOne.writeValue(message);
      }else{
        await characteristicTwo.writeValue(message);
      }
      
    } catch(error) {
      log('Argh! ' + error);
    }
  }

  function log(msg){
    console.log(msg);
  }

  async function send(isOne,r,g,b,w){
    if(isOne){
      if(characteristicOne!=undefined){
        let message = new Uint8Array([r,g,b,w]);
        try {
            await characteristicOne.writeValue(message);
          } catch (error) {
            log('Argh! ' + error);
          }
      }
    }else{
      if(characteristicTwo!=undefined){
        let message = new Uint8Array([r,g,b,w]);
        try {
            await characteristicTwo.writeValue(message);
          } catch (error) {
            log('Argh! ' + error);
          }
      }
    }
  }