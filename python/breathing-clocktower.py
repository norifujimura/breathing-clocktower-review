# https://zenn.dev/knowhere_imai/articles/ba850780152b01
#import p5
import pygame
from pygame.locals import *
import sys

import asyncio
import time

import json
from pprint import pprint
from ctypes import *
from bleak import BleakClient

from datetime import datetime as dt

#address = "19C40D9B-F748-1109-CF66-67D6BB739283" # 通信先のMacアドレス
address = "24:58:7C:5C:83:DD"
CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8" # CHARACTERISTIC_UUID


x = 0
y = 0
screen = 0
minute = 0
state = "none"
previousState = "none"
json_data = 0
image = 0
counter = 0
font =0
font_s= 0
r = 0
g = 0
b = 0

async def say_after(delay, what):
    print(f"prepare {what} at {time.strftime('%X')}")
    await asyncio.sleep(delay)
    print(f"{what} at {time.strftime('%X')}")

async def my_loop(delay, what):
    global x,y
    while True:
        # return rateを1 Hzに設定
        print(f"{what} x: {x}  y: {y} at {time.strftime('%X')}")
        await asyncio.sleep(delay)

async def ble_byte_reconnect(address,delay):
    global x,y

    while True:
        async with BleakClient(
            address
        ) as client:
            message_received = await client.read_gatt_char(CHARACTERISTIC_UUID)
            print("message_received : {0}".format("".join(map(chr, message_received ))))
            
            while True:

                #message = bytearray( b'\x30\x30')
                message = bytearray(3)
                message[0] = r
                message[1] = g                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                message[2] = b
                # return rateを1 Hzに設定
                try:
                    await client.write_gatt_char(CHARACTERISTIC_UUID,message,response=True)
                    await asyncio.sleep(delay)
                    #print("connected")
                except Exception:
                    print("DISConnected now reconnect")
                    break

async def ble_json_reconnect(address,delay):
    global x,y

    while True:
        async with BleakClient(
            address
        ) as client:
            message_received = await client.read_gatt_char(CHARACTERISTIC_UUID)
            print("message_received : {0}".format("".join(map(chr, message_received ))))
            
            while True:
                message = {
                    "x":x,
                    "y":y
                }
                
                message_b = json.dumps(message).encode('utf-8')
                # return rateを1 Hzに設定
                try:
                    await client.write_gatt_char(CHARACTERISTIC_UUID,message_b,response=True)
                    #await client.write_gatt_char(CHARACTERISTIC_UUID,message_b)
                    await asyncio.sleep(delay)
                    #print("connected")
                except Exception:
                    print("DISConnected now reconnect")
                    break
            
async def ble_json(address,delay):
    global x,y

    async with BleakClient(address) as client:
        message_received = await client.read_gatt_char(CHARACTERISTIC_UUID)
        print("message_received : {0}".format("".join(map(chr, message_received ))))
        
        #info = "{\"x\": \"100\",\"y\":\"100\"}" # put your large data here
        #length = len(info)
        #factory_info_bytes = create_string_buffer(info.encode('utf-8'), length)
        while True:

            message = {
                "x":x,
                "y":y
            }
            
            #masseage_b = json.dumps(message).encode('utf-8')
            message_b = json.dumps(message).encode('utf-8')
            # return rateを1 Hzに設定
            await client.write_gatt_char(CHARACTERISTIC_UUID,message_b,response=True)
            await asyncio.sleep(delay)

def stateCheck():
    global minute,state,previousState,json_data,image,counter
    previousState = state
    '''
    if 0<=minute and minute<=3:
        state = "azabu-chihiro"
    if 4<=minute and minute<=7:
        state = "azabu-haruhito"
    if 8<=minute and minute<=11:
        state = "azabu-miharu"
    if 12<=minute and minute<=15:
        state = "azabu-ohana"
    if 16<=minute and minute<=19:
        state = "azabu-sae"
    if 20<=minute and minute<=23:
        state = "minato-kaito"
    if 24<=minute and minute<=27:
        state = "minato-maiko"
    if 28<=minute and minute<=31:
        state = "minato-taito"
    if 32<=minute and minute<=35:
        state = "minato-yohko"
    if 36<=minute and minute<=39:
        state = "roppongi-hiroyuki"
    if 40<=minute and minute<=43:
        state = "roppongi-kyosei"
    if 44<=minute and minute<=47:
        state = "roppongi-masahiko"
    if 48<=minute and minute<=51:
        state = "roppongi-takenari"
    if 52<=minute and minute<=59:
        state = "roppongi-tatsuo"
        '''
    
    if 0<=minute and minute<=1:
        state = "azabu-chihiro"
    if 2<=minute and minute<=3:
        state = "azabu-haruhito"
    if 4<=minute and minute<=5:
        state = "azabu-miharu"
    if 6<=minute and minute<=7:
        state = "azabu-ohana"
    if 8<=minute and minute<=9:
        state = "azabu-sae"
    if 10<=minute and minute<=11:
        state = "minato-kaito"
    if 12<=minute and minute<=13:
        state = "minato-maiko"
    if 14<=minute and minute<=15:
        state = "minato-taito"
    if 16<=minute and minute<=17:
        state = "minato-yohko"
    if 18<=minute and minute<=19:
        state = "roppongi-hiroyuki"
    if 20<=minute and minute<=21:
        state = "roppongi-kyousei"
    if 22<=minute and minute<=23:
        state = "roppongi-masahiko"
    if 24<=minute and minute<=25:
        state = "roppongi-takenari"
    if 26<=minute and minute<=29:
        state = "roppongi-tatsuo"

    if 30<=minute and minute<=31:
        state = "azabu-chihiro"
    if 32<=minute and minute<=33:
        state = "azabu-haruhito"
    if 34<=minute and minute<=35:
        state = "azabu-miharu"
    if 36<=minute and minute<=37:
        state = "azabu-ohana"
    if 38<=minute and minute<=39:
        state = "azabu-sae"
    if 40<=minute and minute<=41:
        state = "minato-kaito"
    if 42<=minute and minute<=43:
        state = "minato-maiko"
    if 44<=minute and minute<=45:
        state = "minato-taito"
    if 46<=minute and minute<=47:
        state = "minato-yohko"
    if 48<=minute and minute<=49:
        state = "roppongi-hiroyuki"
    if 50<=minute and minute<=51:
        state = "roppongi-kyousei"
    if 52<=minute and minute<=53:
        state = "roppongi-masahiko"
    if 54<=minute and minute<=55:
        state = "roppongi-takenari"
    if 55<=minute and minute<=59:
        state = "roppongi-tatsuo"

    if previousState != state:
        loadJson()
        image = pygame.image.load("./images/"+state+".jpeg")
        image = pygame.transform.smoothscale(image, (1920, 1500)) 
        image.set_alpha(45)
        counter = 0

def loadJson():
    global state,json_data
    with open("./data/"+state+".json") as json_file:
        json_data = json.load(json_file)
        pprint(json_data)

def drawCursor():
    global counter,screen

    pygame.draw.line(screen, (0,0,0), (0,540), (1920,540), 1)
    pygame.draw.line(screen, (255,255,255), (counter,0), (counter,1080), 1)

def drawLines():
    global counter,screen,json_data
    for i in range(0,counter):
        center = 540
        point1 = json_data['array'][i]
        point2 = json_data['array'][i+1]
        value1 =0
        value2 = 0
        if point1['value'] is not None:
            value1 = float(point1['value']) * -1.2 + center
        if point2['value'] is not None:
            value2 = float(point2['value']) * -1.2 + center
        pygame.draw.aaline(screen, (255,255,255), (i,value1), (i+1,value2), 1)

def drawPoints():
    global counter,screen,json_data
    for i in range(0,counter):
        center = 540
        point1 = json_data['array'][i]
        #point2 = json_data['array'][i+1]

        value1 =0
        r =0
        g =0
        b =0

        if point1['value'] is not None:
            value1 = float(point1['value']) * -1.2 + center
            r = int(point1['r']) 
            g = int(point1['g']) 
            b = int(point1['b']) 
            pygame.draw.circle(screen, (r,g,b), (i,value1),5)
    
        #value2 = float(point2['value']) * 1.2 + center
        #pygame.draw.aaline(screen, (255,255,255), (i,value1), (i+1,value2), 1)

def drawGuide():
    global font_s,counter,screen,json_data
    center = 540
    
    point1 = json_data['array'][counter]
    
    if point1['value'] is not None:
        value1 = float(point1['value']) * -1.2 + center
        text = 0
        if value1<center:
            text = font_s.render(f'吐く息/exhale bless', True, (200,200,200))
        else:
            text = font_s.render(f'吸う息/inhale bless', True, (200,200,200))

        screen.blit(text, [counter+5,value1])      
    



async def pygame_loop(delay):
    global x,y,font,font_m,font_s,screen,minute,state,json_data,image,counter,r,g,b
    fullscreen = False
    pygame.init() # 初期化
    screen = pygame.display.set_mode((1920,1080)) # ウィンドウサイズの指定
    pygame.display.set_caption("Breathing Clocktower") # ウィンドウの上の方に出てくるアレの指定
    font = pygame.font.Font('./fonts/NotoSansJP-Medium.ttf', 60)
    font_m = pygame.font.Font('./fonts/NotoSansJP-Medium.ttf', 40)
    font_s = pygame.font.Font('./fonts/NotoSansJP-Medium.ttf', 20)
    #minute = 0
    
    while(True):
        counter+=1
        if 1920<counter:
            counter = 0

        length = len(json_data['array'])
        point = json_data['array'][counter]
        value = point['value']
        r = point['r']
        g = point['g']
        b = point['b']

        minute = dt.now().minute

        stateCheck()

        pygame.display.update()

        mouseX, mouseY = pygame.mouse.get_pos()
        text = font.render(f'{mouseX}, {mouseY}', True, (127,127,127))
        #text_jp = json_data['text']
        #text_e = json_data['text-e']

        text_jp=json_data['text']
        text_e=json_data['text-e']
        text_jp_print = font.render(f'{text_jp}', True, (200,200,200))
        text_e_print = font_m.render(f'{text_e}', True, (200,200,200))

        text_rect_jp = text_jp_print.get_rect(center=(1920/2,900))
        text_rect_e = text_e_print.get_rect(center=(1920/2,970))

        add_jp = font_s.render(f'この呼吸データは、六本木で暮らし、働くひとたち１４人に、事前にインタービューと共に実際の呼吸のデータを採取させていただいたものを再生しています。', True, (200,200,200))
        add_e= font_s.render(f'This data of bleathing are pre-recoreded ones  when the artist interviewed 14 local residents of Roppongi.', True, (200,200,200))

        add_rect_jp = add_jp.get_rect(center=(1920/2,200))
        add_rect_e = add_e.get_rect(center=(1920/2,240))

        #text2 = font.render(f'日本語:{minute}:{state}:{counter}:{length}:{value}:{r}:{g}:{b}', True, (255,255,255))
        screen.fill((0,0,0))
        screen.blit(image,(0,-100))
        screen.blit(add_jp, add_rect_jp)
        screen.blit(add_e, add_rect_e)
        screen.blit(text_jp_print,text_rect_jp)
        screen.blit(text_e_print, text_rect_e)
        #screen.blit(text2, [0, 100])
        
        drawLines()
        drawPoints()
        drawCursor()
        drawGuide()
        #pygame.draw.line(screen, (255,255,255), (counter,0), (counter,1080), 1)
        #pygame.draw.line(screen, (127,127,127), (mouseX,0), (mouseX,120), 1)
        #pygame.draw.line(screen, (127,127,127), (0,mouseY), (120,mouseY), 1)
        pygame.display.flip()
        #pygame.display.update() # 画面更新
        #x = mouseX
        #y = mouseY

        for event in pygame.event.get(): # 終了処理
            if event.type == QUIT:
                pygame.quit()
                sys.exit()
                    # Toggle fullscreen when F11 is pressed
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_F11:
                    fullscreen = not fullscreen
                    if fullscreen:
                        screen = pygame.display.set_mode((0, 0), pygame.FULLSCREEN)
                    else:
                        screen = pygame.display.set_mode((1920, 1080))
        await asyncio.sleep(delay)

async def main():
    minute = dt.now().minute

    stateCheck()

    #task1 = asyncio.create_task(my_loop(1, 'hello'))
    #task2 = asyncio.create_task(my_loop(2, 'world'))
    task1 = asyncio.create_task(pygame_loop(0.05))
    task2 = asyncio.create_task(ble_byte_reconnect(address,0.05))


    print(f"started at {time.strftime('%X')}")

    await task1

    print(f"returned from await task1 at {time.strftime('%X')}")

    await task2

    print(f"finished at {time.strftime('%X')}")
    #asyncio.run(run(renderer="vispy",frame_rate=20))

asyncio.run(main())
