void setupLED(){
  strip.updateLength(ledLength);
  strip.begin();           // INITIALIZE NeoPixel strip object (REQUIRED)
  strip.show();            // Turn OFF all pixels ASAP
  strip.setBrightness(ledBrightness);
}

void showLED(){
  /*
  for(int i=0; i<(len-1);i++){
    int index = round(i/4);

    int w;
    w = buf[i];

    uint32_t  c = strip.Color(w,w,w,w);
    strip.setPixelColor(index, c);         //  Set pixel's color (in RAM)
  }
  */
  for(int i=0; i<ledLength ;i++){

    uint32_t  c = strip.Color(0,0,0,brightness);
    strip.setPixelColor(i, c);         //  Set pixel's color (in RAM)
  }
  strip.show();  
}

void showLEDBytes(){
  for(int i=0; i<ledLength ;i++){
      uint32_t  c = getRGBW2(r,g,b,1.0);
      strip.setPixelColor(i, c);         //  Set pixel's color (in RAM)
  }

  strip.show(); 
}

uint32_t getRGBW2(int r,int g,int b,float ratio){
  if(r<=g && r<=b){
    int w = r;
    r = 0;
    g = g-w;
    b = b-w;

    rw = round(r * ratio);
    gw = round(g * ratio);
    bw = round(b * ratio);
    ww = round(w * ratio/2);
    uint32_t  c = strip.Color(rw,gw,bw,ww);
    return c;
  }else if(g<=r && g<=b){
    int w = g;
    r = r-w;
    g = 0;
    b = b-w;
    rw = round(r * ratio);
    gw = round(g * ratio);
    bw = round(b * ratio);
    ww = round(w * ratio/2);
    uint32_t  c = strip.Color(rw,gw,bw,ww);
    return c;
  }else if(b<=r && b<=g){
    int w = b;
    r = r-w;
    g = g-w;
    b = 0;
    rw = round(r * ratio);
    gw = round(g * ratio);
    bw = round(b * ratio);
    ww = round(w * ratio/2);
    uint32_t  c = strip.Color(rw,gw,bw,ww);
    return c;
  }
    uint32_t  c = strip.Color(0,0,0,0);
    return c;
}

uint32_t getRGBW(int r,int g,int b){
  if(r<=g && r<=b){
    int w = r;
    r = 0;
    g = g-w;
    b = b-w;
    uint32_t  c = strip.Color(r,g,b,w);
    return c;
  }else if(g<=r && g<=b){
    int w = g;
    r = r-w;
    g = 0;
    b = b-w;
    uint32_t  c = strip.Color(r,g,b,w);
    return c;
  }else if(b<=r && b<=g){
    int w = r;
    r = r-w;
    g = g-w;
    b = 0;
    uint32_t  c = strip.Color(r,g,b,w);
    return c;
  }
    uint32_t  c = strip.Color(0,0,0,0);
    return c;
}
