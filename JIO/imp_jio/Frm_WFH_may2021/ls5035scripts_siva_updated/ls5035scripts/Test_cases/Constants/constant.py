class deviceState:
    fastboot = 'fastboot'
    online = 'device'
    recovery = 'recovery'
    offline = 'offline'
    un_auth = 'unauthorized'
    devices = ' devices'


class operation:
    List = 'List of devices attached'
    reboot = 'reboot'
    bootloader = 'reboot-bootloader'
    root = 'root'
    remount = 'remount'
    adb = "adb "
    fastboot = "fastboot devices"
    adb_shell = "adb shell "
    shell = " shell "
    adb_s = "adb -s "
    get_state = "get-state"
    UI_check = " shell getprop sys.boot_completed"
    display = " shell input keyevent 224"
    APN = " shell settings get global airplane_mode_on"
    BLE = " shell settings get global bluetooth_on"
    Wifi = " shell settings get global wifi_on"
   """ Data = " shell settings get global mobile_data"
    volume = " shell settings get global media volume --set 10"
    Call = " shell am start -a android.intent.action.CALL -d tel:+918886467606"
    Camera = " shell am start -a android.media.action.IMAGE_CAPTURE"
    fm = " shell settings get global am start -n com.caf.fmradio/com.caf.fmradio.FMRadio"
    video = " shell settings get global am start -a android.intent.action.VIEW -d file:/sdcard/video.mp4.mp4 -t video/mp4"
    music = " shell settings get global am start -a android.intent.action.VIEW -d file:/sdcard/music.mp3.mp3 -t audio/mp3"
    Brightness = " shell settings get global screen_brightness_mode"
    """
    """mute  =  " shell settings get system volume_mute_system "
    unmute = " shell settings get system volume_unmute_system "
    """
    md = " shell getprop ro.product.model"
# c=re.search(r'([A-Za-z.0-9:]+\s+(device|offline|fastboot)\b',i)
