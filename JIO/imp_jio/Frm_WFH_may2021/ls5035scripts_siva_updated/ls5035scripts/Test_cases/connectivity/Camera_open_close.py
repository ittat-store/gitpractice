import time

from Test_cases.Constants.constant import *
import subprocess


def Camera_open(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running camera open Test Iteration : ", i + 1)
            Camera_method = operation.adb_s + dev + " shell am start -a android.media.action.IMAGE_CAPTURE"	    
            result = subprocess.getoutput(Camera_method)
            Camera_method1 = operation.adb_s + dev + " shell input keyevent 27 "
            result1 = subprocess.getoutput(Camera_method1)
    #return True if subprocess.getoutput(operation.adb + operation.Camera) == '1' else False


def Camera_shot(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running Camera shot Test Iteration : ", i + 1)

            Camera_method = operation.adb_s + dev + " shell input keyevent 3 "
            result = subprocess.getoutput(Camera_method)

    #return True if subprocess.getoutput(operation.adb + operation.Camera) == '0' else False


def valid_Camera(dev,Iter):
    with open('Camera_open_shot.log', 'w') as file:
        subprocess.call("adb logcat *:D -d |findstr Camera", stdout=file)
    a,b=Camera_open(dev, Iter), Camera_shot(dev, Iter)
    file.close()
    time.sleep(5)
    if a and b :
        return True
    else:
        return False
