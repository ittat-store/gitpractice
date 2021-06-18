import time

from Test_cases.Constants.constant import *
import subprocess


def Brightness_up(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running Brightness up Test Iteration : ", i + 1)
            Brightness_method = operation.adb_s + dev + " shell input keyevent 221"
            result = subprocess.getoutput(Brightness_method)
    return True if subprocess.getoutput(operation.adb + operation.Brightness) == '1' else False


def Brightness_down(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running Brightness down Test Iteration : ", i + 1)
            Brightness_method = operation.adb_s + dev + " shell input keyevent 220"
            result = subprocess.getoutput(Brightness_method)
    return True if subprocess.getoutput(operation.adb + operation.Brightness) == '0' else False


def valid_Brightness(dev,Iter):
    with open('Brightness_up_down.log', 'w') as file:
        subprocess.call("adb logcat *:D -d |findstr Bright", stdout=file)
    a,b=Brightness_up(dev, Iter), Brightness_down(dev, Iter)
    file.close()
    time.sleep(5)
    if a and b :
        return True
    else:
        return False
