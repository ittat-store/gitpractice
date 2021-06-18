import time

from Test_cases.Constants.constant import *
import subprocess

from ls5035scripts.Test_cases.Constants.constant import operation


def fm_on(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running fm_on Iteration : ", i + 1)
            fm_on_method = operation.adb_s + dev + " shell am start -n com.caf.fmradio/com.caf.fmradio.FMRadio "
            result = subprocess.getoutput(fm_on_method)
    return True if subprocess.getoutput(operation.adb + operation.fm) == '1' else False


def fm_off(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running fm_off Iteration : ", i + 1)
            fm_off_method = operation.adb_s + dev + " shell input keyevent KEYCODE_HOME "
            result = subprocess.getoutput(fm_off_method)
    return True if subprocess.getoutput(operation.adb + operation.fm) == '0' else False


def valid_fm(dev,Iter):
    with open('fm_on_off.log', 'w') as file:
        subprocess.call("adb logcat *:D -d |findstr  fm", stdout=file)
    a,b=fm_on(dev, Iter), fm_off(dev, Iter)
    file.close()
    time.sleep(5)
    if a and b :
        return True
    else:
        return False