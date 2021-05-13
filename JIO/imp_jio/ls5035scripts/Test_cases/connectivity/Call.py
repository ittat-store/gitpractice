import time

from Test_cases.Constants.constant import *
import subprocess


def Call(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running Call Test Iteration : ", i + 1)
            Call_method = operation.adb_s + dev + "  shell am start -a android.intent.action.CALL -d tel:+972527300294 "
            result = subprocess.getoutput(Call_method)
            sleep(15)
	    Call_method1 = operation.adb_s + dev + " shell input keyevent 6 "
            result = subprocess.getoutput(Call_method1)
    return True if subprocess.getoutput(operation.adb + operation.Call) == '1' else False


def valid_Call(dev,Iter):
    with open('Call.log', 'w') as file:
        subprocess.call("adb logcat *:D -d |findstr call", stdout=file)
    a=Call(dev, Iter)
    file.close()
    time.sleep(5)
    if a  :
        return True
    else:
        return False
