import time

from Test_cases.Constants.constant import *
import subprocess


def Call_connect(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running call connect  Test Iteration : ", i + 1)
            Call_method = operation.adb_s + dev + " shell am start -a android.intent.action.CALL -d tel:+918886467606"
            result = subprocess.getoutput(Call_method)
    return True if subprocess.getoutput(operation.adb + operation.Call) == '1' else False


def Call_dis(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running Call disconnect Test Iteration : ", i + 1)
            Call_method = operation.adb_s + dev + " shell input keyevent 6"
            result = subprocess.getoutput(Call_method)
    return True if subprocess.getoutput(operation.adb + operation.Call) == '0' else False


def valid_Call(dev,Iter):
    with open('Call_conn_dis.log', 'w') as file:
        subprocess.call("adb logcat *:D -d |findstr Call", stdout=file)
    a,b=Call_connect(dev, Iter), Call_dis(dev, Iter)
    file.close()
    time.sleep(5)
    if a and b :
        return True
    else:
        return False
