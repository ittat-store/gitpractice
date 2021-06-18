# siva prakash netti
# adb devices detection script

from Test_cases.Constants.constant import *
import  subprocess


class Adb_devices:

    def devices(self):
        try:
            subprocess.check_call("adb wait-for-device", timeout=20, shell=True)
        except Exception:
            print("No devices listed")
            quit()
        adb_output = subprocess.getoutput(operation.adb + deviceState.devices)
        if adb_output.strip() == operation.List:
            print("No devices are listed")
            quit()
        adb_output = adb_output.split()[4:]
        return adb_output

    def dev_ids(self):
        dev_state_id = {}
        dl = self.devices()
        for i in range(len(dl)):
            if i % 2 != 0:
                if dl[i] in dev_state_id:
                    dev_state_id[dl[i]].append(dl[i - 1])
                else:
                    dev_state_id[dl[i]] = [(dl[i - 1])]
        return dev_state_id

    def dev_online(self):
        dl = self.dev_ids()
        for i in dl:
            if i == deviceState.online:
                return set(dl[i])
                # return [dl[i] for i in dl if i==deviceState.online]


# if __name__=="__main__":
# a = Adb_devices()
# print(a.devices())
# APN_On_Off(a.dev_online(),5)


# a,b=self.devices()[::2],self.devices()[1::2]

# def props(self,deviceState):
#     return [i for i in deviceState.__dict__.keys() if i[:1] != '_']
# def dev_ids(self):
#     # dev_id={deviceState.i:[] for i in self.props(deviceState)}
#     # for i in self.devices():
#     dev_id={}
#     for i in self.props(deviceState):
#         print(i)
#         dev_id[eval("deviceState".i)]=[]
#         #dev_id[i]
#     print(dev_id)
# a=Adb_devices()
# print(a.dev_online())
