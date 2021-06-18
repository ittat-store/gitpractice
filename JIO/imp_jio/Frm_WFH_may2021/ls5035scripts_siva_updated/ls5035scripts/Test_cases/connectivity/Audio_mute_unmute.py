"""
import time

from Test_cases.Constants.constant import *
import subprocess


def audio_mute(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running Audio mute  Iteration : ", i + 1)
            audio_mute_method = operation.adb_s + dev + "shell input keyevent 164"
            result = subprocess.getoutput(audio_mute_method)
    return True if subprocess.getoutput(operation.adb + operation.audio_mute) == '1' else False


def audio_unmute(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running Audio Unmute Iteration : ", i + 1)
            audio_unmute_method = operation.adb_s + dev + "shell service call audio 8 i32 0 i32 0"
            result = subprocess.getoutput(audio_unmute_method)
    return True if subprocess.getoutput(operation.adb + operation.audio_unmute) == '0' else False


def valid_audio_mute(dev,Iter):
    with open('audio_mute_unmute.log', 'w') as file:
        subprocess.call("adb logcat *:D -d |findstr  audio_mute", stdout=file)
    a,b=audio_mute(dev, Iter), audio_unmute(dev, Iter)
    file.close()
    time.sleep(5)
    if a and b :
        return True
    else:
        return False
"""