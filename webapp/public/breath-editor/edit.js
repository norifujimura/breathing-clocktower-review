var data = {};

var state = "init"


var fps = 20;

let w = fps*120;
let dataWindowWidth= fps*120;
let h = 512;
//let hPlus = 50;
//let offset = 0;
//let offsetMax = 0;


var dataPlayPos= 0;//0 to w

var ratioElem,offsetElem,warmPeakElem,coolPeakElem,warmElem,coolElem,checkElem,whiteMaxElem,whiteMinElem,baseAdjustElem;
var characteristicOne,characteristicTwo;
var isNewColor = true;

function setup(){
    console.log("Setup")
    frameRate(fps);

    var myCanvas = createCanvas(w,h);
    myCanvas.parent('viewCanvas');

    baseAdjustElem = document.getElementById('baseAdjust'); 
    ratioElem = document.getElementById('ratio'); 
    offsetElem = document.getElementById('offset'); // input要素

    baseAdjustElem.addEventListener('input', onBaseAdjust); 
    ratioElem.addEventListener('input', onRatio); 
    offsetElem.addEventListener('input', onOffset); 

    /*
    warmPeakElem = document.getElementById('warmPeak');
    coolPeakElem = document.getElementById('coolPeak');
    warmPeakElem.addEventListener('input', onWarmPeak); 
    coolPeakElem.addEventListener('input', onCoolPeak); 
    */

    warmElem = document.getElementById('warm'); // input要素
    coolElem = document.getElementById('cool'); // input要素
    warmElem.addEventListener('input', onWarm,false); 
    coolElem.addEventListener('input', onCool,false); 

    /*
    checkElem = document.getElementById('check');  
    checkElem.addEventListener('input', onColor,false); 
    */

    /*
    whiteMaxElem = document.getElementById('whiteMax'); 
    whiteMinElem = document.getElementById('whiteMin'); 
    whiteMaxElem.addEventListener('input', onWhiteMax,false); 
    whiteMinElem.addEventListener('input', onWhiteMin,false); 
    */

    isNewColor = true;
    
    data.ratio = 1.0;

    /*
    data.white = {};
    data.white.max = 500;
    data.white.min = 0;
    */

    data.warm = {};
    //data.warm.peak = 500;
    data.cool = {};
    //data.cool.peak = 0;
    
    //data.white.max = 500;
    //data.white.min = 0;

    showParameters();

    /*
    warmColorPicker= createColorPicker();
    warmColorPicker.position = warmCElem.position;

    coolColorPicker= createColorPicker();
    coolColorPicker.position = coolCElem.position;
    */
}

function draw(){
  showParameters();
    if(state == "loaded"){
        //process();
        
        background(10);
        drawDots();
        drawLine();
        drawCursorLine();
        drawBaseCenterLine();
        //drawPeakLineWhite();
        //drawLinesWhite();

        //drawLinesColors();

        //drawPeakLineRGB();
        //drawWhite();

        //drawColors();

        //send(true);
       // send(false);
    }
}

function showParameters(){
    //document.getElementById('name').textContent = "name:"+data.name.full+" jp:"+data.name.jp+" en:"+data.name.en;
    document.getElementById('name').textContent = "name:"+data.name_full+ " ja:"+data.name_jp+ " en:"+data.name_en;
    document.getElementById('type').textContent = "type:"+data.type;
    document.getElementById('version').textContent = "version:"+data.version;
    document.getElementById('length').textContent = "length:"+data.length;
    document.getElementById('milliseconds').textContent = "milliseconds:"+data.milliseconds;
    document.getElementById('milSecPerData').textContent = "milSecPerData:"+(data.milliseconds / data.length);
    document.getElementById('high').textContent = "high:"+data.high;
    document.getElementById('low').textContent = "low:"+data.low;
    document.getElementById('basePressure').textContent = "basePressure:"+data.basePressure;
    document.getElementById('fps').textContent = "FPS:"+fps + " data-width/fps = "+ dataWindowWidth / fps +"sec";

    document.getElementById('baseAdjustLabel').textContent = "Base Adjust:"+data.basePressureAdjust;
    document.getElementById('ratiotLabel').textContent = "Ratio:"+data.ratio;
    document.getElementById('offsetLabel').textContent = "Offset:"+data.offset;
    /*
    document.getElementById('warmPeakLabel').textContent = "Warm peak:"+data.warm.peak;
    document.getElementById('coolPeakLabel').textContent = "Cool peak:"+data.cool.peak;
    document.getElementById('whiteMaxLabel').textContent = "White Max:"+data.white.max;
    document.getElementById('whiteMinLabel').textContent = "White Min:"+data.white.min;
    */
}

function drawDots(){
    //let ratio = w/dataWindowWidth;

    for(let i = 0; i < w; i++){
        let dataPos  = i+data.offset;
        let x = i;
        let rgb = getRGB2(dataPos);
        //vaue shall be 128 to -128
        let y = h/2 - rgb.value; //0,0 is left-up
        var v = round(rgb.value);
        console.log("value:"+v + "r:"+rgb.r+ "g:"+rgb.g+ "b:"+rgb.b);


        noStroke();
        //var white = color(255,255,255,5+rgbw.w);
        //var white = color(5+rgbw.w,5+rgbw.w,5+rgbw.w,255);
        var rgbTemp = color(rgb.r,rgb.g,rgb.b);
 
        //fill(rgb);
        //ellipse(x*ratio, y, 7);
        fill(rgbTemp);
        //ellipse(x*ratio, y, 7);
        ellipse(x, y, 7);
    }   
}

function drawLine(){
  //let ratio = w/dataWindowWidth;

  for(let i = 0; i < (w-1); i++){
      let index = data.offset+i;

      /*
      if(data.length <= index){
        return;
      }
        */

      let xZero = i;
      let rgbZero = getRGB2(index);
      let yZero = h/2 - rgbZero.value; //0,0 is left-up

      let xOne = i+1;
      let rgbOne = getRGB2(index+1);
      let yOne = h/2 - rgbOne.value; //0,0 is left-up

      //noStroke();
      stroke(255);
      strokeWeight(1);

      //line(xZero*ratio, yZero, xOne*ratio, yOne);
      line(xZero, yZero, xOne, yOne);
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

function getRGB2(dataPos){

  if(dataPos>data.array.length){
    dataPos = dataPos - data.array.length;
  }
  var rgb={r:127,g:127,b:127,value:0};
  var value = data.array[dataPos];
  var base = (data.basePressure + data.basePressureAdjust);
  var diff = value - base;
  //console.log("data:"+value+" base:"+base+" diff:"+diff);
  var value = diff*data.ratio;
  rgb.value = value;
  //console.log("ratio:"+data.ratio);

  //console.log("value:"+rgb.value);

   //vaue shall be 128 to -128

  if(value< -128){
    value = -128;
  }

  if(value>128){
    value = 128;
  }

  if(0<value){
  //warm
    var ratio = value/128;
    rgb.r = round(data.warm.r * ratio);
    rgb.g = round(data.warm.g * ratio);
    rgb.b = round(data.warm.b * ratio);
  }else{
  //cool
    var ratio = value/128 * -1;
    rgb.r = round(data.cool.r * ratio);
    rgb.g = round(data.cool.g * ratio);
    rgb.b = round(data.cool.b * ratio);
  }

  return rgb;
}

function getRGBW(dataPos){
  var rgbw={r:127,g:127,b:127,w:127,value:0};
  rgbw.value = (data.array[dataPos] - data.basePressure)*data.ratio + h/2;

  if(rgbw.value <= data.white.min){
    rgbw.w = 0;
  }else if(data.white.max <= rgbw.value){
    rgbw.w = 255;
  }else{
    var ratio = float(rgbw.value - data.white.min) / float(data.white.max - data.white.min);
    rgbw.w = parseInt(ratio * 255.0);
  }

  if(rgbw.value <= data.cool.peak){
    rgbw.r = data.cool.r;
    rgbw.g = data.cool.g;
    rgbw.b = data.cool.b;
  }else if(data.warm.peak <= rgbw.value){
    rgbw.r = data.warm.r;
    rgbw.g = data.warm.g;
    rgbw.b = data.warm.b;
  }else{
    var ratio = float(rgbw.value - data.cool.peak) / float(data.warm.peak - data.cool.peak);
    rgbw.r = parseInt(lerp(data.cool.r,data.warm.r,ratio));
    rgbw.g = parseInt(lerp(data.cool.g,data.warm.g,ratio));
    rgbw.b = parseInt(lerp(data.cool.b,data.warm.b,ratio));
  }


  /*
  if(isNewColor){
    brightnessRatioWhite = value / data.peakWhite;
    brightnessWhite = 127.0 + 127.0 * brightnessRatioWhite;

  }else{
    brightnessRatioWhite = Math.abs(value) / data.peakWhite;
    brightnessWhite = 255.0 * brightnessRatioWhite;
  }
  */

  //lerp(a, b, 0.2);

  /*
  let brightnessRatioRGB = Math.abs(value) / data.peakRGB;
  if(brightnessRatioRGB>1){
    brightnessRatioRGB=1.0;
  }

  if(value >= 0){
    rgb = data.warm;
  }else{
    rgb = data.cool;
  }

  rgbw.r= check(rgb.r * brightnessRatioRGB);
  rgbw.g= check(rgb.g * brightnessRatioRGB);
  rgbw.b= check(rgb.b * brightnessRatioRGB);
  
  rgbw.value = value;
  */

  return rgbw;
}

function getRGB(dataPos){
  var rgb={r:127,g:127,b:127,value:0};
  var value = data.array[dataPos];
  var base = (data.basePressure + data.basePressureAdjust);
  var diff = value - base;
  //console.log("data:"+value+" base:"+base+" diff:"+diff);
  rgb.value = diff*data.ratio;
  //console.log("ratio:"+data.ratio);

  //console.log("value:"+rgb.value);

  /*
  if(rgb.value <= data.cool.peak){
    rgb.r = data.cool.r;
    rgb.g = data.cool.g;
    rgb.b = data.cool.b;
  }else if(data.warm.peak <= rgb.value){
    rgb.r = data.warm.r;
    rgb.g = data.warm.g;
    rgb.b = data.warm.b;
  }else{
    var ratio = float(rgb.value - data.cool.peak) / float(data.warm.peak - data.cool.peak);
    rgb.r = parseInt(lerp(data.cool.r,data.warm.r,ratio));
    rgb.g = parseInt(lerp(data.cool.g,data.warm.g,ratio));
    rgb.b = parseInt(lerp(data.cool.b,data.warm.b,ratio));
  }
    */


  /*
  if(isNewColor){
    brightnessRatioWhite = value / data.peakWhite;
    brightnessWhite = 127.0 + 127.0 * brightnessRatioWhite;

  }else{
    brightnessRatioWhite = Math.abs(value) / data.peakWhite;
    brightnessWhite = 255.0 * brightnessRatioWhite;
  }
  */

  //lerp(a, b, 0.2);

  /*
  let brightnessRatioRGB = Math.abs(value) / data.peakRGB;
  if(brightnessRatioRGB>1){
    brightnessRatioRGB=1.0;
  }

  if(value >= 0){
    rgb = data.warm;
  }else{
    rgb = data.cool;
  }

  rgbw.r= check(rgb.r * brightnessRatioRGB);
  rgbw.g= check(rgb.g * brightnessRatioRGB);
  rgbw.b= check(rgb.b * brightnessRatioRGB);
  
  rgbw.value = value;
  */

  return rgb;
}

function check(val){
  if(val>255.0){
    return 255.0;
  }
  if(val<0.0){
    return 0.0;
  }
  return val;
}

function drawBaseCenterLine(){
  strokeWeight(1);
  stroke(30);
  line(0, h/2, w, h/2);
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

function drawLinesWhite(){
  var max = data.white.max;
  var min = data.white.min;
  strokeWeight(1);
  stroke(255);
  line(0, h-max, w, h-max);
  stroke(127);
  line(0, h-min, w, h-min);
}

function drawLinesColors(){
  strokeWeight(1);
  
  stroke(data.warm.r,data.warm.g,data.warm.b,255);
  line(0, h-data.warm.peak, w, h-data.warm.peak);
  stroke(data.cool.r,data.cool.g,data.cool.b,255);
  line(0, h-data.cool.peak, w, h-data.cool.peak);
}

function drawPeakLineWhite(){
    strokeWeight(1);
    stroke(127);
    var value = data.peakWhite;
    var center = h/2;
    line(0, center , w, center );
    stroke(255);
    line(0, center + value, w, center + value);
    line(0, center - value, w, center - value);
}

function drawPeakLineRGB(){
    strokeWeight(1);

    var value = data.peakRGB;
    var center = h/2;
    
    stroke(data.warm.r,data.warm.g,data.warm.b,255);
    line(0, center - value, w, center - value);
    stroke(data.cool.r,data.cool.g,data.cool.b,255);
    line(0, center + value, w, center + value);
}

const onColor = (e) =>{
  //var ratioTemp = e.target.value / 1000.0;
  isNewColor = checkElem.checked;
  console.log("onColor");
}

const onBaseAdjust = (e) =>{
  //var ratioTemp = e.target.value / 1000.0;
  data.basePressureAdjust = parseFloat(e.target.value);
}

const onRatio = (e) =>{
  //var ratioTemp = e.target.value / 1000.0;
  data.ratio = parseFloat(e.target.value);
}

const onOffset = (e) =>{
    var ratio = e.target.value / 1000.0;
    data.offset = parseInt(data.length * ratio);
}

/*
const onWhiteMax = (e) =>{
  data.white.max = parseInt(e.target.value);
}

const onWhiteMin = (e) =>{
  data.white.min = parseInt(e.target.value);
}

const onWarmPeak = (e) =>{
  data.warm.peak= parseInt(e.target.value);
}

const onCoolPeak = (e) =>{
  data.cool.peak= parseInt(e.target.value);
}
  */

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

/*
function rgb2hex ( r,g,b ) {
    var rgb = {r,g,b}
	return "#" + rgb.map( function ( value ) {
		return ( "0" + value.toString( 16 ) ).slice( -2 ) ;
	} ).join( "" ) ;
}
*/

function rgb2hex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }

//file
function openFileOne(){
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = e => { 
        // getting a hold of the file reference
        var file = e.target.files[0]; 
        //data.name = file.name.replace(".txt", "");
        // setting up the reader
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {

            var value = readerEvent.target.result; // this is the content!
            //rawData = value.replace("�", "");
            data = JSON.parse(value);
            data.ratio = 1;
            data.offset = 0;
            data.basePressureAdjust = 0;
            //data.brightnessWhite = h/4;
            //data.brightnessRGB = h/4;
            data.warm = {};
            data.cool = {};
            data.warm.r = 255;
            data.warm.g = 127;
            data.warm.b = 255;
            data.cool.r = 127;
            data.cool.g = 255;
            data.cool.b = 255;
            /*
            data.peakWhite = 127;
            data.peakRGB = 127;
            peakWhiteElem.max = h/2;
            peakWhiteElem.value = data.peakWhite;
            peakRGBElem.max = h/2;
            peakRGBElem.value = data.peakRGB;
            */
            state = "loaded";
            //console.log( content );
            //process();
        }
    }
    input.click();
}

function openFileTwo(){
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = e => { 
        // getting a hold of the file reference
        var file = e.target.files[0]; 
        //data.name = file.name.replace(".txt", "");
        // setting up the reader
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            console.log("reader.onload");
            var value = readerEvent.target.result; // this is the content!
            //rawData = value.replace("�", "");
            data = JSON.parse(value);
            data.name = file.name.replace(".json", "");
            if(data.ratio == undefined){
              data.ratio = 1.0;
            }
            if(data.white == undefined){
              data.white = {};
              data.white.max = 500;
              data.white.min = 0;
            }
            if(data.warm.peak == undefined)data.warm.peak = 500;
            if(data.cool.peak == undefined)data.cool.peak = 0;

            ratioElem.value = data.ratio;
            warmPeakElem.max = h;
            warmPeakElem.value = data.warm.peak;
            coolPeakElem.max = h;
            coolPeakElem.value = data.cool.peak;
            warmElem.value = rgb2hex(data.warm.r,data.warm.g,data.warm.b);
            coolElem.value = rgb2hex(data.cool.r,data.cool.g,data.cool.b);

            state = "loaded";
            //console.log( content );
            //process();
        }
    }
    input.click();
}

function saveFileTwo(){
  data.version = 2;
  saveJson(data);
}

function saveFileThree(){
  data.version = 3;
  saveJson(data);
}

function saveJson(json) {
    const d = new Date();
    var fileName = data.name+".json";

    var json = JSON.stringify(data);
    const blob = new Blob([json],{type:"application/json"});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

function saveData(){
  var dataTwo = {};
  dataTwo.version = 2;
  dataTwo.array = [];
  dataTwo.fileName = data.fileName;
  dataTwo.text = data.text;

  for(let i = 0; i < w; i++){
    let dataPos  = i+data.offset;
    let x = i;
    let rgb = getRGB2(dataPos);
    dataTwo.array.push(rgb)
  }  

  var fileName = data.fileName+".json";

  var json = JSON.stringify(dataTwo);
  const blob = new Blob([json],{type:"application/json"});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();

}


/*
function saveData(){
    var text = "";

    for(let i = 0; i < dataWindowWidth; i++){
        let dataPos  = data.offset+i;
        let rgbw = getRGBW(dataPos);

        let rTwo = Math.round(rgbw.r);
        let gTwo = Math.round(rgbw.g);
        let bTwo = Math.round(rgbw.b);
        let wTwo = Math.round(rgbw.w);

        text += rTwo+","+gTwo+","+bTwo+","+wTwo+"\n";
    }   

    saveString(text);
}
*/

function saveString(string) {
    //const d = new Date();
    //var fileName = "breath-"+d+".txt"
    var fileName = data.name+".txt";

    const blob = new Blob([string],{type:"text/plain"});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
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
    let dataPos = data.offset + dataPlayPos;
    let rgbw = getRGBW(dataPos);

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


