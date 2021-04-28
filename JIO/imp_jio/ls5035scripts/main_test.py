#import multiprocessing
# import threading
import os
import time

import pandas as pd

from Test_cases.connectivity import APN_on_off, BLE_on_off, Wifi_on_off, Data_on_off
from adb_devices import *


ad = Adb_devices()
device = ad.dev_online()


def main(times=1):
    times=int(times)
    t = {}
    t_result = {"APN": APN_on_off.valid_APN(device, times), "Ble": BLE_on_off.valid_BLE(device, times),
                "Wifi": Wifi_on_off.valid_Wifi(device, times), "Data": Data_on_off.valid_Data(device, times), 
		"Camera": Camera.valid_Camera(device, times),   "Call": Call.valid_Call(device, times)}
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
