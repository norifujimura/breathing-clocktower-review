
var data ={
    type:'ncir',
    array:[],
    length:0,
    milliseconds:0,
    high:0,
    low:200000,
    temp:0,
    baseTemp:0
}

var startTime;
//var centerValue;
var string = "";
let w = 1000;
let h = 500;
var c ;

var state = "init";//init,reading,read
//window.onload = setup;

function setup(){
    console.log("Setup")
    frameRate(20);
    if ("serial" in navigator) {
        // The Web Serial API is supported.
        console.log("Serial is supported")
    }else{
        console.log("Serial is NOT supported")
    }

    var myCanvas = createCanvas(w,h);
    myCanvas.parent('recorderCanvas');

    //createCanvas(w, h);
}

function draw(){
    //console.log("Draw")

    if(state == "reading"){
        return;
    }
  
    drawDots();
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
    //console.log("drawDots l = "+data.length);
    // draw lines

    let ratio = 5;

    if(state == "reading"){
        return;
    }

    if(data.length<1){
        return;
    }

    var l = w;

    if(data.length<(w)){
        l = data.length;
    }

    let temp = (data.array[data.length-i] - data.baseTemp) * ratio;
    let distance = Math.abs(temp);
    let percent = distance /100;

    if(percent<0){
        percent = 0;
    }else if(percent>1){
        return;
    }

    background(10);

    noStroke();
    c = color(255,255,255,5+250*percent);
    fill(c);
    //ellipse(w/2, h/2, w, h);
    ellipse(w/2, h/2, h, h);


    for(let i =0; i < l; i++){
        //console.log("drawDots i = "+i);
        //let x = i * (width / (numPts-1));
        let x = i
        let temp = (data.array[data.length-i] - data.baseTemp) * ratio;
        let y = (h/2) - temp;
        let distance = Math.abs(temp);
        //console.log("distance:"+distance+"\n");

        let percent = distance /100;
        if(percent>1){
            percent = 1;
        }

        noStroke();
        c = color(255,255,255,5+250*percent);
        //c = color(255,255,255,255);
        fill(c);
        ellipse(x, y, 7);
    } 
    
}


function updateData(base,d){
    //console.log("UpdateData");
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

function resetData(){

    var tempBaseTemp= data.baseTemp;

    data ={
        array:[],
        length:0,
        milliseconds:0,
        high:0,
        low:200000,
        baseTemp:tempBaseTemp
    }
}

async function openPort(){
    console.log("Open1");
    // Prompt user to select any serial port.
    const port = await navigator.serial.requestPort();
    // Wait for the serial port to open.
    await port.open({ baudRate: 9600 });
    console.log("Open2");
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
                state = "reading";

                //add is it ends with \n
                v = buffer + v;
                v = v.replace("\n", "");

                var valueArray = v.split(",");

                var baseTemp = parseFloat(valueArray[0]);
                var temp = parseFloat(valueArray[1]);
                if(baseTemp  != null && temp  != null){
                    if(baseTemp>10){
                        updateData(baseTemp, temp);
                    }
                    
                }
                
                //string += v;
                console.log(v+"\n");
                console.log("base:"+baseTemp+" temp:"+temp+"\n");

                buffer = "";
                state = "read";
            }else{
                //wait if not 
                buffer = v;
            }
        }
    }
}

/*
window.document.getElementById('open').addEventListener('click', async () => {
    // Prompt user to select any serial port.
    const port = await navigator.serial.requestPort();
    // Wait for the serial port to open.
    await port.open({ baudRate: 250000 });

    //const reader = port.readable.getReader();

    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();

    // Listen to data coming from the serial device.
    var buffer = "";
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
                var f = parseFloat(v);
                if(f != null){
                    array.push(f);
                }
                
                //string += v;
                console.log(v+"\n");

                buffer = "";
            }else{
                //wait if not 
                buffer = v;
            }
        }
    }
});
*/

function saveString() {
    const d = new Date();
    var fileName = "breath-"+d+".txt"

    const blob = new Blob([string],{type:"text/plain"});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

function saveData(){
    saveJson(data);
}

function saveJson(json) {
    const d = new Date();
    var fileName = "breath-"+d+".json"
    var data = JSON.stringify(json);
    const blob = new Blob([data],{type:"application/json"});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}


/*
document.getElementById('open').addEventListener('click',open,false);

function open(){
    // Prompt user to select any serial port.
    const port = navigator.serial.requestPort();
    // Wait for the serial port to open.
    port.open({ baudRate: 250000 });
}
*/