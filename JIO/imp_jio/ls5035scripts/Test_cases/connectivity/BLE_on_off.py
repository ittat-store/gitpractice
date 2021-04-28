import subprocess
from Test_cases.Constants.constant import *


def BLE_on(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running BLE ON Test Iteration : ", i + 1)
            BLE_method = operation.adb_s + dev + "  shell service call bluetooth_manager 6"
            result = subprocess.getoutput(BLE_method)
    return True if subprocess.getoutput(operation.adb + operation.BLE) == '1' else False


def BLE_off(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running BLE OFF Test Iteration : ", i + 1)
            BLE_method = operation.adb_s + dev + "  shell service call bluetooth_manager 8"
            result = subprocess.getoutput(BLE_method)
    return True if subprocess.getoutput(operation.adb + operation.BLE) == '1' else False


def valid_BLE(dev,Iter):
    with open('BLE_on_off.log', 'w') as file:
        subprocess.call("adb logcat *:D -d |findstr  Bluetooth", stdout=file)
    a,b=BLE_on(dev, Iter), BLE_off(dev, Iter)
    file.close()
    if a and b :
        return True
    else:
        return False
