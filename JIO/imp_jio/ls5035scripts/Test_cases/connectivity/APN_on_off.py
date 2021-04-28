import time

from Test_cases.Constants.constant import *
import subprocess


def APN_on(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running APN ON Test Iteration : ", i + 1)
            APN_method1 = operation.adb_s + dev + " shell settings put global airplane_mode_on 1"
            result = subprocess.getoutput(APN_method1)
            APN_method2 = operation.adb_s + dev + " shell am broadcast -a android.intent.action.AIRPLANE_MODE"
            result_1 = subprocess.getoutput(APN_method2)
    return True if subprocess.getoutput(operation.adb + operation.APN) == '1' else False


def APN_off(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running APN OFF Test Iteration : ", i + 1)
            APN_method1 = operation.adb_s + dev + " shell settings put global airplane_mode_on 0"
            result = subprocess.getoutput(APN_method1)
            APN_method2 = operation.adb_s + dev + " shell am broadcast -a android.intent.action.AIRPLANE_MODE"
            result_1 = subprocess.getoutput(APN_method2)
    return True if subprocess.getoutput(operation.adb + operation.APN) == '0' else False


def valid_APN(dev,Iter):
    with open('APN_on_off.log', 'w') as file:
        subprocess.call("adb logcat *:D -d |findstr  Airplane", stdout=file)
    a,b=APN_on(dev, Iter), APN_off(dev, Iter)
    file.close()
    time.sleep(5)
    if a and b :
        return True
    else:
        return False