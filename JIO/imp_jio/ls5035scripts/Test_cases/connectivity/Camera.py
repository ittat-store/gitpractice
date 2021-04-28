import time

from Test_cases.Constants.constant import *
import subprocess


def Camera_open(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running Camera Open Test Iteration : ", i + 1)
            Camera_method = operation.adb_s + dev + " adb shell am start -a android.media.action.IMAGE_CAPTURE"
            result = subprocess.getoutput(Camera_method)
    return True if subprocess.getoutput(operation.adb + operation.Camera) == '1' else False


def valid_Camera(dev,Iter):
    with open('Camera_open.log', 'w') as file:
        subprocess.call("adb logcat *:D -d |findstr Camera", stdout=file)
    a,b=Camera_open(dev, Iter)
    file.close()
    time.sleep(5)
    if a  :
        return True
    else:
        return False
