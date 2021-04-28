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
    Data = " shell settings get global mobile_data"
    volume = " shell settings get global media volume --set 10"
    Call = "  shell settings get global am start -a android.intent.action.CALL -d tel:+9188864 67606"
    Camera = " shell settings get global am start -a android.media.action.IMAGE_CAPTURE"
    """
    mute  =  " shell settings get system volume_mute_system "
    unmute = " shell settings get system volume_unmute_system "
    """
    md = " shell getprop ro.product.model"
# c=re.search(r'([A-Za-z.0-9:]+\s+(device|offline|fastboot)\b',i)
