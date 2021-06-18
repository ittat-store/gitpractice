import time

from Test_cases.Constants.constant import *
import subprocess


def Wifi_on(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running Wifi ON Test Iteration : ", i + 1)
            Wifi_method = operation.adb_s + dev + " shell svc wifi enable"
            result = subprocess.getoutput(Wifi_method)
    return True if subprocess.getoutput(operation.adb + operation.Wifi) == '1' else False


def Wifi_off(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running Wifi OFF Test Iteration : ", i + 1)
            Wifi_method = operation.adb_s + dev + " shell svc wifi disable"
            result = subprocess.getoutput(Wifi_method)
    return True if subprocess.getoutput(operation.adb + operation.Wifi) == '0' else False


def valid_Wifi(dev,Iter):
    with open('Wifi_on_off.log', 'w') as file:
        subprocess.call("adb logcat *:D -d |findstr  Airplane", stdout=file)
    a,b=Wifi_on(dev, Iter), Wifi_off(dev, Iter)
    file.close()
    time.sleep(5)
    if a and b :
        return True
    else:
        return False