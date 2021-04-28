import time

from Test_cases.Constants.constant import *
import subprocess


def Data_on(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running Data ON Test Iteration : ", i + 1)
            Data_method = operation.adb_s + dev + "shell svc data enable"
            result = subprocess.getoutput(Data_method)
    return True if subprocess.getoutput(operation.adb + operation.Data) == '1' else False


def Data_off(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running Data OFF Test Iteration : ", i + 1)
            Data_method = operation.adb_s + dev + " shell svc data disable"
            result = subprocess.getoutput(Data_method)
    return True if subprocess.getoutput(operation.adb + operation.Data) == '0' else False


def valid_Data(dev,Iter):
    with open('Data_on_off.log', 'w') as file:
        subprocess.call("adb logcat *:D -d |findstr Data", stdout=file)
    a,b=Data_on(dev, Iter), Data_off(dev, Iter)
    file.close()
    time.sleep(5)
    if a and b :
        return True
    else:
        return False
