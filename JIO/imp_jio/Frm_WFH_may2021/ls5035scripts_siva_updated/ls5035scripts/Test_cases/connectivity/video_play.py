import time

from Test_cases.Constants.constant import *
import subprocess

from ls5035scripts.Test_cases.Constants.constant import operation

def video_play(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running video_play Iteration : ", i + 1)
            video_play_method = operation.adb_s + dev + " shell am start -a android.intent.action.VIEW -d file:/sdcard/video.mp4.mp4 -t video/mp4 "
            result = subprocess.getoutput(video_play_method)
    return True if subprocess.getoutput(operation.adb + operation.video) == '1' else False


def video_off(device, Iterations):
    for i in range(Iterations):
        for dev in device:
            subprocess.call(operation.adb_s + dev + operation.display)
            print("running video_off Iteration : ", i + 1)
            video_off_method = operation.adb_s + dev + " shell input keyevent KEYCODE_HOME "
            result = subprocess.getoutput(video_off_method)
    return True if subprocess.getoutput(operation.adb + operation.video) == '0' else False


def valid_video(dev,Iter):
    with open('video_play_off.log', 'w') as file:
        subprocess.call("adb logcat *:D -d |findstr  video", stdout=file)
    a,b=video_play(dev, Iter), video_off(dev, Iter)
    file.close()
    time.sleep(5)
    if a and b :
        return True
    else:
        return False