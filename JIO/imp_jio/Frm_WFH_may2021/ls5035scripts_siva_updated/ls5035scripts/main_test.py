#import multiprocessing
# import threading
import os
import time


import pandas as pd

from Test_cases.connectivity import APN_on_off, BLE_on_off, Call_connect_dis, Camera_open_close, Data_on_off, Volume_up_down, Wifi_on_off, fm_on_off, video_play, music_play, Brightness_up_down
from adb_devices import *

ad = Adb_devices()
device = ad.dev_online()


def main(times=1):
    times=int(times)
    t = {}
    t_result = {"APN": APN_on_off.valid_APN(device, times), "Ble": BLE_on_off.valid_BLE(device, times),
                "Wifi": Wifi_on_off.valid_Wifi(device, times), "Data": Data_on_off.valid_Data(device, times),
                "volume": Volume_up_down.valid_volume(device, times), "Camera": Camera_open_close.valid_Camera(device, times),
                "Call": Call_connect_dis.valid_Call(device, times), "fm": fm_on_off.valid_fm(device, time), "video": video_play.valid_video(device, time), "music": music.valid_music(device, time), "Brightness": Brightness_up_down.valid_Brightness(device, times)}
    # file_name = subprocess.getoutput(operation.adb + operation.md) + str(datetime.datetime.now()) + ".xlsx"
    for i in t_result:
        t[i] = " Pass " if t_result[i] == True else " Fail "
    r_d = {'test_name': t.keys(), 'test_result': t.values()}
    w = pd.DataFrame(r_d)
    file_name = pd.ExcelWriter("sanity.xlsx", engine="xlsxwriter")
    w.to_excel(file_name, sheet_name="Sanity_results")
    file_name.save()


if __name__ == '__main__':
    main(2)
