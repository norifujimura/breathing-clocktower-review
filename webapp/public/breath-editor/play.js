//var rgbw = {r:0,g:0,b:0,w:0};
var data = {
    array:[],
    length,
    name
  }
var state = "init"

let dataWindowWidth= 2000;
let w = 1000;
let h = 500;
//let offset = 0;
//let offsetMax = 0;

var fps = 20;
var dataPlayPos= 0;//0 to w

var characteristicOne,characteristicTwo;

function setup(){
    console.log("Setup")
    frameRate(fps);
    var myCanvas = createCanvas(w,h);
    myCanvas.parent('playCanvas');
}

function draw(){
    if(state == "loaded"){
        //process();
        showParameters();
        background(10);
        //drawDots();
        drawCursorLine();

        send(true);
        send(false);
    }
}

function showParameters(){
    document.getElementById('name').textContent = "name:"+data.name;
    document.getElementById('length').textContent = "length:"+data.length;
    document.getElementById('pos').textContent = "pos:"+dataPlayPos;
}

function drawDots(){
    let ratio = w/dataWindowWidth;

    for(let i = 0; i < dataWindowWidth; i++){
        let dataPos  = i+data.offset;
        let x = i;
        let rgbw = getRGBW(dataPos);
        let y = (h/2) - rgbw.value;

        noStroke();
        var white = color(255,255,255,5+rgbw.w);
        var rgb = color(rgbw.r,rgbw.g,rgbw.b,255);
 
        fill(rgb);
        ellipse(x*ratio, y, 7);
        fill(white);
        ellipse(x*ratio, y, 7);
    }   
}

function drawColors(){
    let dataPos = data.offset + dataPlayPos;
    let rgbw = getRGBW(dataPos);

    noStroke();
    c = color(rgbw.r,rgbw.g,rgbw.b,255);

    fill(c);
    rect(0, h+hPlus/2, w,hPlus/2);
}

function drawWhite(){
    let dataPos = data.offset + dataPlayPos;
    let rgbw = getRGBW(dataPos);

    noStroke();
    c = color(255,255,255,rgbw.w);
    
    fill(c);
    rect(0, h, w,hPlus/2);
}

function getRGBW(dataPos){

    let value = (data.array[dataPos] - data.basePressure);
    let brightnessRatioWhite = Math.abs(value) / data.peakWhite;
    let brightnessWhite = 255.0 * brightnessRatioWhite;

    let brightnessRatioRGB = Math.abs(value) / data.peakRGB;

    var rgb;

    if(brightnessRatioRGB>1){
        brightnessRatioRGB=1.0;
    }

    if(brightnessRatioWhite >1){
        brightnessRatioWhite =1.0;
    }


    if(value >= 0){
        rgb = data.warm;
    }else{
        rgb = data.cool;
    }

    var rgbw={r:0,g:0,b:0,value:0};
    
    rgbw.r= rgb.r * brightnessRatioRGB;
    rgbw.g= rgb.g * brightnessRatioRGB;
    rgbw.b= rgb.b * brightnessRatioRGB;
    rgbw.w= brightnessWhite;
    rgbw.value = value;

    return rgbw;
}

function drawCursorLine(){
    if(dataWindowWidth<=dataPlayPos){
        dataPlayPos= 0;
    }
    strokeWeight(2);
    stroke(255);
    let ratio =  w / dataWindowWidth;
    let pos = Math.round(dataPlayPos*ratio);
    line(pos, 0, pos, h);

    //console.log("playPos"+dataPlayPos);
    dataPlayPos++;
}

function hex2rgb ( hex ) {
	if ( hex.slice(0, 1) == "#" ) hex = hex.slice(1) ;
	if ( hex.length == 3 ) hex = hex.slice(0,1) + hex.slice(0,1) + hex.slice(1,2) + hex.slice(1,2) + hex.slice(2,3) + hex.slice(2,3) ;

	return [ hex.slice( 0, 2 ), hex.slice( 2, 4 ), hex.slice( 4, 6 ) ].map( function ( str ) {
		return parseInt( str, 16 ) ;
	} ) ;
}

function rgb2hex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }

//file
function openFile(){
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';

    input.onchange = e => { 
        // getting a hold of the file reference
        var file = e.target.files[0]; 
        //data.name = file.name.replace(".txt", "");
        // setting up the reader
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
          data.name = file.name.replace(".txt", "");
          var value = readerEvent.target.result; // this is the content!
          let valArray = value.split('\n');
          data.length = valArray.length-1;

          console.log("Length:"+data.length);

          for(let i = 0; i < data.length; i++){
            var array = valArray[i].split(',');
            var rgbw = {
              r:array[0],
              g:array[1],
              b:array[2],
              w:array[3]
            };
            //console.log("line:"+JSON.stringify(rgbw));
            data.array.push(rgbw);
          }
          state = "loaded";

            //console.log( content );
            //process();
        }
    }
    input.click();
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
    //let dataPos = data.offset + dataPlayPos;
    //let rgbw = getRGBW(dataPos);
    let rgbw = data.array[dataPlayPos];

    if(isOne){
      if(characteristicOne!=undefined){
        //console.log("send One:"+rgbw.r);
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


