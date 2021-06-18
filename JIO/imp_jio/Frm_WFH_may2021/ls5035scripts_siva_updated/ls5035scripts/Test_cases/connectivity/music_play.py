import time

from Test_cases.Constants.constant import *
import subprocess

from ls5035scripts.Test_cases.Constants.constant import operation

def music_play(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running music_play Iteration : ", i + 1)
            music_play_method = operation.adb_s + dev + " shell am start -a android.intent.action.VIEW -d file:/sdcard/music.mp3.mp3 -t audio/mp3 "
            result = subprocess.getoutput(music_play_method)
    return True if subprocess.getoutput(operation.adb + operation.music) == '1' else False


def music_off(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running music_off Iteration : ", i + 1)
            music_off_method = operation.adb_s + dev + " shell input keyevent KEYCODE_HOME "
            result = subprocess.getoutput(music_off_method)
    return True if subprocess.getoutput(operation.adb + operation.music) == '0' else False


def valid_music(dev,Iter):
    with open('music_play_off.log', 'w') as file:
        subprocess.call("adb logcat *:D -d |findstr  music", stdout=file)
    a,b=music_play(dev, Iter), music_off(dev, Iter)
    file.close()
    time.sleep(5)
    if a and b :
        return True
    else:
        return False