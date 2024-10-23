#include <M5UnitENV.h>



/*
*******************************************************************************
* Copyright (c) 2021 by M5Stack
*                  Equipped with M5Core2 sample source code
*                          配套  M5Core2 示例源代码
* Visit for more information: https://docs.m5stack.com/en/unit/envIII
* 获取更多资料请访问: https://docs.m5stack.com/zh_CN/unit/envIII
*
* Product: ENVIII_SHT30_QMP6988.  环境传感器
* Date: 2022/7/20
*******************************************************************************
  Please connect to Port A,Read temperature, humidity and atmospheric pressure
  and display them on the display screen
  请连接端口A,读取温度、湿度和大气压强并在显示屏上显示
*/
#include <M5Core2.h>
//#include <M5_ENV.h>
#include "M5UnitENV.h"
//#include "UNIT_ENV.h"

/*
SHT3X sht30;
QMP6988 qmp6988;
*/

SHT3X sht3x;
QMP6988 qmp;

float tmp      = 0.0;
float hum      = 0.0;
float pressure = 0.0;
float basePressure = 0.0;

//for graph
#define MAX_LEN 320
#define X_OFFSET 0
#define Y_OFFSET 120
#define X_SCALE 1
int pt;
int16_t val_buf[MAX_LEN] = {0};
//

void graph(int value,int fromLow,int fromHigh) {
  
  val_buf[pt] = map((int16_t)(value * X_SCALE), fromLow, fromHigh,  100, 0);

  if (--pt < 0) {
    pt = MAX_LEN - 1;
  }

  for (int i = 1; i < (MAX_LEN); i++) {
    int now_pt = (pt + i) % (MAX_LEN);
    M5.Lcd.drawLine(i + X_OFFSET, val_buf[(now_pt + 1) % MAX_LEN] + Y_OFFSET, i + 1 + X_OFFSET, val_buf[(now_pt + 2) % MAX_LEN] + Y_OFFSET, TFT_BLACK);
    if (i < MAX_LEN - 1) {
      M5.Lcd.drawLine(i + X_OFFSET, val_buf[now_pt] + Y_OFFSET, i + 1 + X_OFFSET, val_buf[(now_pt + 1) % MAX_LEN] + Y_OFFSET, TFT_WHITE);
    }
  }
}

void setup() {
    M5.begin();             // Init M5Core2.  初始化M5Core2
    M5.lcd.setTextSize(2);  // Set the text size to 2.  设置文字大小为2
    Wire.begin();  // Wire init, adding the I2C bus.  Wire初始化, 加入i2c总线
    //qmp6988.init();

    M5.Lcd.setTextColor(YELLOW);
    M5.lcd.println(F("ENVIII Unit(SHT30 and QMP6988)"));
    M5.Lcd.setTextColor(WHITE);
    Serial.begin(250000);
    //Serial.begin(2000000);

    if (!qmp.begin(&Wire, QMP6988_SLAVE_ADDRESS_L, 32, 33, 400000U)) {
        Serial.println("Couldn't find QMP6988");
        while (1) delay(1);
    }

    /*
    if (!sht3x.begin(&Wire, SHT3X_I2C_ADDR, 32, 33, 400000U)) {
        Serial.println("Couldn't find SHT3X");
        while (1) delay(1);
    }
    */
}

void loop() {
  M5.update();  //Read the press state of the key.  读取按键 A, B, C 的状态

  if (qmp.update()) {
    pressure = qmp.pressure;
  }

  //pressure = qmp6988.calcPressure();
  
  if (M5.BtnA.wasReleased() || M5.BtnA.pressedFor(1000, 200)) {
    showBatteryLevel();
    basePressure = pressure;
    M5.Lcd.println('A');
    Serial.println('A');
  }
  
   graph(pressure,basePressure - 100,basePressure + 100);//100222
    
    /*
    if (sht30.get() == 0) {  // Obtain the data of shT30.  获取sht30的数据
        tmp = sht30.cTemp;   // Store the temperature obtained from shT30.
                             // 将sht30获取到的温度存储
        hum = sht30.humidity;  // Store the humidity obtained from the SHT30.
                               // 将sht30获取到的湿度存储
    } else {
        tmp = 0, hum = 0;
    }
    */
    
    M5.lcd.fillRect(0, 20, 300, 100,
                    BLACK);  // Fill the screen with black (to clear the
                             // screen).  将屏幕填充黑色(用来清屏)
    M5.lcd.setCursor(0, 20);
    M5.Lcd.printf("Temp: %2.3f  \r\nHumi: %2.3f%%  \r\nPressure:%2.1fPa\r\n",
                  tmp, hum, pressure);
    M5.lcd.setCursor(0, 80);
    M5.Lcd.printf("BasePressure:%2.1fPa\r\n",
                  basePressure);
    //Serial.printf("Pressure:%fPa\r\n",pressure);
    String s = String(basePressure)+","+String(pressure);
    Serial.println(s);
    delay(10);
}

void showBatteryLevel(){
  //https://community.m5stack.com/topic/2994/core2-how-to-know-the-current-battery-level/4
  float batVoltage = M5.Axp.GetBatVoltage();
  float batPercentage = ( batVoltage < 3.2 ) ? 0 : ( batVoltage - 3.2 ) * 100;
  String s = String("Battery:")+String(batPercentage ).c_str()+String("%");
   //M5.Lcd.drawString(s, 0, 100, 1); 
  int i = (int) batPercentage;
  M5.Lcd.setCursor(0, 240-30);
  M5.Lcd.setTextSize(2);
  M5.Lcd.print(s);
  M5.Lcd.progressBar(0, 240-10, 320, 20, i); 
}
