var data ={
    array:[],
    length:0,
    milliseconds:0,
    high:0,
    low:200000,
    temp:0,
    baseTemp:0
}

var rgbw={
    r:0,
    g:0,
    b:0,
    w:0,
    value:0
}

var startTime;
//var centerValue;
var string = "";
let w = 1000;
let h = 500;
var c ;
var ratio = 20;
var fps = 20;

var tempElem,baseTempElem,ratioElem,checkElem;

var characteristicOne,characteristicTwo;
var isNewColor = true;

//window.onload = setup;

function setup(){
    console.log("Setup")
    frameRate(fps);
    if ("serial" in navigator) {
        // The Web Serial API is supported.
        console.log("Serial is supported")
    }else{
        console.log("Serial is NOT supported")
    }

    var myCanvas = createCanvas(w,h);
    myCanvas.parent('canvas');

    tempElem = document.getElementById('temp'); 
    baseTempElem = document.getElementById('baseTemp'); 
    ratioElem = document.getElementById('ratio'); 

    ratioElem.addEventListener('input', onRatio); 

    warmElem = document.getElementById('warm'); // input要素
    coolElem = document.getElementById('cool'); // input要素
    warmElem.addEventListener('input', onWarm,false); 
    coolElem.addEventListener('input', onCool,false); 

    data.warm = {};
    data.cool = {};
    data.warm.r = 255;
    data.warm.g = 127;
    data.warm.b = 255;
    data.cool.r = 127;
    data.cool.g = 255;
    data.cool.b = 255;

    checkElem = document.getElementById('check');  
    checkElem.addEventListener('input', onColor,false); 
    isNewColor = true;

    //createCanvas(w, h);
}

function draw(){
    //console.log("Draw")

    /*
    if(isNewColor){
      console.log("new");
    }else{
      console.log("old");
    }
    */
    
    //console.log(data.temp+":"+data.baseTemp);
    //background(10);
  
    tempElem.textContent = "Temp:"+data.temp;
    baseTempElem.textContent = "BaseTemp:"+data.baseTemp;
    drawDots();

    send(true);
    send(false);
    //drawLight();
    //drawEllipses();
}
/*
function drawEllipses(){
    noStroke();
      // draw ellipses
    for(let i =0; i < 400; i++){
      let x = i * (width / (numPts-1));
      let y = randomY[i];
      ellipse(x, y, 7);
    }
  }
  */

function drawLight(){
    noStroke();
    fill(c);
    ellipse(w/2, h/4*3, 20);
}
  
function drawDots(){

    
    // draw lines

    if(data.length<1){
        return;
    }

    var l = w;

    if(data.length<(w)){
        l = data.length;
    }



    //console.log(l);

    var rgbw = getRGBW(data.length-1);

    noStroke();
    cOne = color(rgbw.r,rgbw.g,rgbw.b,127);
    cTwo = color(rgbw.w,rgbw.w,rgbw.w,127);
    //console.log("p:"+percent+" temp:"+data.temp+" bTemp:"+data.baseTemp);

    console.log("r:"+rgbw.r+"g:"+rgbw.g+"b:"+rgbw.b+"w:"+rgbw.w);

    if(rgbw.w<255){
      //background(10);

      blendMode(BLEND);
      background(10);
      blendMode(ADD);
      
      fill(cOne);
      ellipse(w/2, h/2, w, h);
      fill(cTwo);
      ellipse(w/2, h/2, w, h);
    }


    this.rgbw = rgbw;

    for(let i =0; i < l-1; i++){
        //let x = i * (width / (numPts-1));
        let x = i;
        var rgbw = getRGBW(data.length-i)

        //let y = (h/2) - (data.array[data.length-i] - data.basePressure) ;
       let y = (h/2) - rgbw.value;
       //let y = (h/2);

        noStroke();
        //if(rgbw.r!=NaN && rgbw.g!=NaN && rgbw.b!=NaN){
          //console.log("r:"+rgbw.r+"g:"+rgbw.g+"b:"+rgbw.b);
          //c = color(rgbw.r,rgbw.g,rgbw.b,255);
          cOne = color(rgbw.r,rgbw.g,rgbw.b,127);
          cTwo = color(rgbw.w,rgbw.w,rgbw.w,127);
          //c = color(127,127,127);
          
          fill(cOne);
          ellipse(x, y, 7);
          fill(cTwo);
          ellipse(x, y, 7);
       // }

    } 
}

function getRGBW(dataPos){

  var rgbw={r:0,g:0,b:0,value:0};
  var rgb;
  let value = (data.array[dataPos] - data.baseTemp)*ratio;

  if(isNewColor){
   // console.log("newColor");
    //h= 500 midH =250

    //simply show 0 in buttom and 255 at the top

    //ratio in h=500 space 
    let brightnessRatio = (250.0 + value) / 500.0;
  
    //console.log("br:"+brightnessRatio);
    if(brightnessRatio>1.0){
        brightnessRatio = 1.0;
    }
    if(brightnessRatio<0.0){
      brightnessRatio = 0.0;
    }

    let colorRatio = Math.abs(value) / 250.0;
  
    if(value >= 0){
        rgb = data.warm;
    }else{
        rgb = data.cool;
    }
    
    rgbw.r= rgb.r * colorRatio;
    rgbw.g= rgb.g * colorRatio;
    rgbw.b= rgb.b * colorRatio;
    rgbw.w= 255.0 * brightnessRatio;
    
    rgbw.r= Math.round(rgbw.r);
    rgbw.g= Math.round(rgbw.g);
    rgbw.b= Math.round(rgbw.b);
    rgbw.w= Math.round(rgbw.w);
    rgbw.value = value;
  }else{
    let brightnessRatio = Math.abs(value) / 250.0;
  
    if(value >= 0){
        rgb = data.warm;
    }else{
        rgb = data.cool;
    }

    //console.log("br:"+brightnessRatio);
    if(brightnessRatio>1.0){
        brightnessRatio = 1.0;
    }
    
    rgbw.r= rgb.r * brightnessRatio;
    rgbw.g= rgb.g * brightnessRatio;
    rgbw.b= rgb.b * brightnessRatio;
    rgbw.w= 255.0 * brightnessRatio;

    rgbw.r= Math.round(rgbw.r);
    rgbw.g= Math.round(rgbw.g);
    rgbw.b= Math.round(rgbw.b);
    rgbw.w= Math.round(rgbw.w);
    rgbw.value = value;
  }
  return rgbw;
}

function updateData(base,d){
    if((data.baseTemp - base)>0.9 && (data.baseTemp - base)%10 == 0) {
        return;
    }

    data.temp = d;
    data.array.push(d);
    data.length = data.array.length;
    if(d>data.high){
        data.high = d;
    }else if(d<data.low){
        data.low = d;
    }
    //centerValue = (data.high + data.low)/2.0;
    data.milliseconds= Date.now() - startTime;

    //traveling average
    var l = 100;
    if(data.length<100){
        l = data.length;
    }
    var sum = 0;
    for(i=0;i<l;i++){
        sum += data.array[(data.length-1)-i];
    }
    //centerValue = sum / l;
    //centerValue = base;
    data.baseTemp = base;
}

async function openPort(){
    console.log("Open");
    // Prompt user to select any serial port.
    const port = await navigator.serial.requestPort();
    // Wait for the serial port to open.
    await port.open({ baudRate: 9600 });

    //const reader = port.readable.getReader();

    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();

    // Listen to data coming from the serial device.
    var buffer = "";
    startTime = new Date();
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            // Allow the serial port to be closed later.
            reader.releaseLock();
            break;
        }
        // value is a Uint8Array.

        var v = value.replace("�", "");

        //pass if empty
        if(v != ''){
            if(v.slice( -1 ) == '\n'){
                //add is it ends with \n
                v = buffer + v;
                v = v.replace("\n", "");

                var valueArray = v.split(",");

                var baseTemp = parseFloat(valueArray[0]);
                var temp = parseFloat(valueArray[1]);
                if(baseTemp  != null){
                    updateData(baseTemp, temp);
                }
                
                //string += v;
                //console.log(v+"\n");
                //console.log("base:"+basePressure+" pressure:"+pressure+"\n");

                buffer = "";
            }else{
                //wait if not 
                buffer = v;
            }
        }
    }
}

const onColor = (e) =>{
  //var ratioTemp = e.target.value / 1000.0;
  isNewColor = checkElem.checked;
  console.log("onColor");
}

const onRatio = (e) =>{
    //var ratioTemp = e.target.value / 1000.0;
    ratio = parseInt(e.target.value);
}

const onWarm = (e) =>{
    data.warm.hex = e.target.value;
    var rgb = hex2rgb(data.warm.hex);
    data.warm.r = rgb[0];
    data.warm.g = rgb[1];
    data.warm.b = rgb[2];
}

const onCool = (e) =>{
    data.cool.hex = e.target.value;
    var rgb = hex2rgb(data.cool.hex);
    data.cool.r = rgb[0];
    data.cool.g = rgb[1];
    data.cool.b = rgb[2];
}

function hex2rgb ( hex ) {
	if ( hex.slice(0, 1) == "#" ) hex = hex.slice(1) ;
	if ( hex.length == 3 ) hex = hex.slice(0,1) + hex.slice(0,1) + hex.slice(1,2) + hex.slice(1,2) + hex.slice(2,3) + hex.slice(2,3) ;

	return [ hex.slice( 0, 2 ), hex.slice( 2, 4 ), hex.slice( 4, 6 ) ].map( function ( str ) {
		return parseInt( str, 16 ) ;
	} ) ;
}

function rgb2hex ( r,g,b ) {
    var rgb = {r,g,b}
	return "#" + rgb.map( function ( value ) {
		return ( "0" + value.toString( 16 ) ).slice( -2 ) ;
	} ).join( "" ) ;
}

//BLE
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

  async function send(isOne){
    var rgbw = this.rgbw;

    if(rgbw.w<255){

      if(isOne){
        if(characteristicOne!=undefined){
          console.log("send One:"+rgbw.r);
          let message = new Uint8Array([rgbw.r,rgbw.g,rgbw.b,rgbw.w]);
          try {
              await characteristicOne.writeValue(message);
            } catch (error) {
              log('Argh! ' + error);
            }
        }
      }else{
        if(characteristicTwo!=undefined){
          console.log("send Two:"+rgbw.r);
          let message = new Uint8Array([rgbw.r,rgbw.g,rgbw.b,rgbw.w]);
          try {
              await characteristicTwo.writeValue(message);
            } catch (error) {
              log('Argh! ' + error);
            }
        }
      }
    }
  }


