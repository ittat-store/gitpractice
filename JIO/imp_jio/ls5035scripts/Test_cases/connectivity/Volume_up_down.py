import time

from Test_cases.Constants.constant import *
import subprocess

from ls5035scripts.Test_cases.Constants.constant import operation
"""
from ls5035scripts.Test_cases.connectivity.Audio_mute_unmute import audio_mute
"""

def volume_up(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running volume up Iteration : ", i + 1)
            volume_up_method = operation.adb_s + dev + " shell media volume --set 15"
            result = subprocess.getoutput(volume_up_method)
    return True if subprocess.getoutput(operation.adb + operation.volume) == '1' else False


def volume_down(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running volume_down Iteration : ", i + 1)
            volume_down_method = operation.adb_s + dev + " shell media volume --set 0"
            result = subprocess.getoutput(volume_down_method)
    return True if subprocess.getoutput(operation.adb + operation.volume) == '0' else False


def valid_volume(dev,Iter):
    with open('volume_up_down.log', 'w') as file:
        subprocess.call("adb logcat *:D -d |findstr  volume", stdout=file)
    a,b=volume_up(dev, Iter), volume_down(dev, Iter)
    file.close()
    time.sleep(5)
    if a and b :
        return True
    else:
        return False