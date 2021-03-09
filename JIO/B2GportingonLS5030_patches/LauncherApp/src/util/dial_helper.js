/* global window, MozActivity */

import BaseEmitter from 'base-emitter';
import Service from 'service';
import { toL10n } from 'util/utils';
import SettingsManager from 'settings-manager';
import LaunchStore from './launch_store';
import SIMSlotManager from 'simslot-manager';
import * as slotToMakeEmergencyCalls from '../Dialer/slotToMakeEmergencyCalls';

// As defined in 3GPP TS 22.030 version 10.0.0 Release 10 standard
// USSD code used to query call barring supplementary service status
const CALL_BARRING_STATUS_MMI_CODE = '*#33#';
// USSD code used to query call waiting supplementary service status
const CALL_WAITING_STATUS_MMI_CODE = '*#43#';

class DialHelper extends BaseEmitter {
  constructor(props) {
    super(props);
    this.validExp = /^(?!,)([0-9#+*,]){1,50}$/;
    this.extraCharExp = /(\s|-|\.|\(|\))/g;
    this.instantDialNumbers = [
      '*#06#',
      '*#07#',
      '*#2886#',
      '*#*#7469#*#*',
      '*#*#5820#*#*',
      '*#*#0574#*#*'
    ];
    //navigator.mozSetMessageHandler('ussd-received', this.onUssdReceived);  // B2G-API

    // hide some number on non-debugger-mode
    SettingsManager.get('debugger.remote-mode').then((remoteMode) => {
      if ('disabled' !== remoteMode) {
        this.debuggerRemoteMode = true;
        this.instantDialNumbers = this.instantDialNumbers.concat([
          '*#0606#',
          '*#8378269#',
          '*#*#2637643#*#*',
          '*#*#33284#*#*'
        ]);
      }
    });
  }

  onUssdReceived = (evt) => {
    let _handleUssd = this.handleUssd;
    if (document.hasFocus()) {
      _handleUssd(evt);
    } else {
      document.addEventListener('focus', function waitForFocus() {
        _handleUssd(evt);
        document.removeEventListener('focus', waitForFocus);
      });
    }
  }

  handleUssd = (evt) => {
    // evt.session means we need to user's interaction
    if (evt.session) {
      this._session = evt.session;

      let cancelSession = () => {
        // for canceling the mmi-loading dialog
        Service.request('hideDialog');
        this.mmiloading = false;
        this._session.cancel();
        this._session = null;
      };

      Service.request('showDialog', {
        type: 'prompt',
        header: toL10n('confirmation'),
        content: evt.message.replace(/\\r\\n|\\r|\\n/g, '\n'),
        translated: true,
        noClose: false,
        onOk: (res) => {
          if (res) {
            this.mmiloading = true;
            this.emit('mmiloading');
            this._session.send(res);
          } else {
            cancelSession();
          }
        },
        onCancel: cancelSession,
        onBack: cancelSession
      });
    } else {
      this.emit('ussd-received', evt);
      this.mmiloading = false;
    }
  }

  errorCases = {
    BadNumber: {
      header: 'invalidNumberToDialTitle',
      content: 'invalidNumberToDialMessage'
    },
    NoNetwork: {
      header: 'emergencyDialogTitle',
      content: 'emergencyDialogBodyBadNumber'
    },
    EmergencyCallOnly: {
      header: 'emergency-call-only',
      content: 'emergency-call-error',
      containNumber: true
    },
    RadioNotAvailable: {
      header: 'callAirplaneModeTitle',
      content: 'callAirplaneModeMessage'
    },
    DeviceNotAcceptedError: {
      header: 'emergencyDialogTitle',
      content: 'emergencyDialogBodyDeviceNotAccepted'
    },
    BusyError: {
      header: 'numberIsBusyTitle',
      content: 'numberIsBusyMessage'
    },
    FDNBlockedError: {
      header: 'fdnIsActiveTitle',
      content: 'fdnIsActiveMessage',
      containNumber: true
    },
    FdnCheckFailure: {
      header: 'fdnIsActiveTitle',
      content: 'fdnIsActiveMessage',
      containNumber: true
    },
    OtherConnectionInUse: {
      header: 'otherConnectionInUseTitle',
      content: 'otherConnectionInUseMessage'
    }
  };

  listDeviceInfos(type) {
  /*  let promises = [...navigator.mozMobileConnections].map((conn, simSlotIndex) => { // B2G-API
      return conn.getDeviceIdentities().then((deviceInfo) => {
        if (deviceInfo[type]) {
          return deviceInfo[type];
        } else {
          let errorMsg = `Could not retrieve the ${type.toUpperCase()} code for SIM ${simSlotIndex}`;
          console.error(errorMsg);
          return Promise.reject(new Error(errorMsg));
        }
      });
    });*/

    Promise.all(promises).then((items) => {
      Service.request('showDialog', {
        type: 'alert',
        header: type.toUpperCase(),
        content: items.join('\n'),
        translated: true,
        noClose: false
      });
    }, (msg) => {
      Service.request('showDialog', {
        type: 'alert',
        header: type.toUpperCase(),
        content: msg.message,
        translated: true,
        noClose: false
      });
    });
  }

  setDebuggerMode(enable) {
    if (enable) {
      SettingsManager.set({
        'debugger.remote-mode': 'adb-devtools'
      });
    } else {
      SettingsManager.set({
        'debugger.remote-mode': 'disabled'
      });
    }
  }

  showSarValue() {
    SettingsManager.get('deviceinfo.sar_value').then((sarValue) => {
      Service.request('showDialog', {
        type: 'alert',
        header: 'SAR Information',
        content: `${sarValue || '0'} W/kg`,
        translated: true,
        noClose: false
      });
    });
  }

  instantDialIfNecessary(telNum) {
    return this.instantDialNumbers.includes(telNum);
  }

  mmiHandler(promise, sentMMI) {
    this.mmiloading = true;
    this.emit('mmiloading');
    promise.then((mmiResult) => {
      if (!mmiResult) {
        this.emit('mmiloaded', '!', 'GenericFailure');
        return;
      }

      let title = toL10n(mmiResult.serviceCode);
      let message = mmiResult.statusMessage;
      let additionalInformation = mmiResult.additionalInformation;

      switch (mmiResult.serviceCode) {
        case 'scCall':
          return;
        case 'scUssd':
          if (!message) {
            return;
          }
          break;
        case 'scCallForwarding':
          if (!message) {
            message = 'GenericFailure';
          } else if (additionalInformation) {
            // Call forwarding requests via MMI codes might return an array of
            // nsIDOMMozMobileCFInfo objects. In that case we serialize that array
            // into a single string that can be shown on the screen.
            message = this.processCf(additionalInformation);
          }
          break;
        case 'scCallBarring':
        case 'scCallWaiting':
          // If we are just querying the status of the service, we show a different message,
          // so the user knows she hasn't change anything
          if (sentMMI === CALL_BARRING_STATUS_MMI_CODE ||
              sentMMI === CALL_WAITING_STATUS_MMI_CODE) {
            let additionalInfor = [];
            let msgCase = {
              'smServiceEnabled': 'ServiceIsEnabled',
              'smServiceDisabled': 'ServiceIsDisabled',
              'smServiceEnabledFor': 'ServiceIsEnabledFor'
            };
            // Call barring and call waiting requests via MMI codes might return an
            // array of strings indicating the service it is enabled for or just
            // the disabled status message.
            if (additionalInformation &&
                'smServiceEnabledFor' === message &&
                Array.isArray(additionalInformation)) {
              additionalInfor = additionalInformation.map(toL10n);
            }
            additionalInfor.unshift(toL10n(msgCase[message]) || message);
            message = additionalInfor.join('\n');
          }
          break;
        default:
          break;
      }
      if ('RadioNotAvailable' === message) {
        message = 'callAirplaneModeMessage';
      }

      this.mmiloading = false;
      this.emit('mmiloaded', title, message);
    });
  }

  // Helper function to compose an informative message about a successful
  // request to query the call forwarding status.
  processCf(result) {
    let inactive = toL10n('call-forwarding-inactive');
    let voice = inactive;
    let data = inactive;
    let fax = inactive;
    let sms = inactive;
    let sync = inactive;
    let async = inactive;
    let packet = inactive;
    let pad = inactive;

    for (let i = 0; i < result.length; i++) {
      if (!result[i].active) {
        continue; // eslint-disable-line no-continue
      }

      for (let serviceClassMask = 1;
           serviceClassMask <= this._conn.ICC_SERVICE_CLASS_MAX;
           serviceClassMask <<= 1) {
        if ((serviceClassMask & result[i].serviceClass) !== 0) {
          switch (serviceClassMask) {
            case this._conn.ICC_SERVICE_CLASS_VOICE:
              voice = result[i].number;
              break;
            case this._conn.ICC_SERVICE_CLASS_DATA:
              data = result[i].number;
              break;
            case this._conn.ICC_SERVICE_CLASS_FAX:
              fax = result[i].number;
              break;
            case this._conn.ICC_SERVICE_CLASS_SMS:
              sms = result[i].number;
              break;
            case this._conn.ICC_SERVICE_CLASS_DATA_SYNC:
              sync = result[i].number;
              break;
            case this._conn.ICC_SERVICE_CLASS_DATA_ASYNC:
              async = result[i].number;
              break;
            case this._conn.ICC_SERVICE_CLASS_PACKET:
              packet = result[i].number;
              break;
            case this._conn.ICC_SERVICE_CLASS_PAD:
              pad = result[i].number;
              break;
            default:
              return toL10n('call-forwarding-error');
          }
        }
      }
    }

    let msg = [
      toL10n('call-forwarding-status'),
      toL10n('call-forwarding-voice', { voice }),
      toL10n('call-forwarding-data', { data }),
      toL10n('call-forwarding-fax', { fax }),
      toL10n('call-forwarding-sms', { sms }),
      toL10n('call-forwarding-sync', { sync }),
      toL10n('call-forwarding-async', { async }),
      toL10n('call-forwarding-packet', { packet }),
      toL10n('call-forwarding-pad', { pad })
    ].join('\n');

    return msg;
  }

  dialForcely(number, serviceId) {
    console.warn('dialForcely', number);
    //navigator.mozTelephony.dial(number, serviceId); // B2G-API
  }

  dial(number, isVideo) {
    // sanitization number
    number = String(number).replace(this.extraCharExp, '');

    if (this.checkSpecialNumber(number)) {
      return Promise.resolve();
    }

    if (!this.isValid(number)) {
      this.errorHandler({ errorName: 'BadNumber' });
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      /*let dialWithCardIndex = (cardIndex) => {
        //let conn = navigator.mozMobileConnections && navigator.mozMobileConnections[cardIndex];  // B2G-API
        let self = this;
        let callPromise;
        let originNumber = number;
        number = this.getNumberAsDtmfToneGroups(originNumber)[0];
        //this._conn = conn;

        // No voice connection, the call won't make it
        /*if (!conn || !conn.voice) {
          reject();
          this.errorHandler({ errorName: 'NoNetwork' });
          return;
        }

        //let telephony = navigator.mozTelephony; // B2G-API
        if (!telephony) {
          reject();
          return;
        }

        let imsCapability = conn.imsHandler && conn.imsHandler.capability;
        let emergencyOnly = !imsCapability && conn.voice.emergencyCallsOnly;
        if (emergencyOnly) {
          callPromise = telephony.dialEmergency(number, cardIndex);
        } else if (isVideo) {
          callPromise = telephony.dialVT(number, 4, cardIndex);
        } else {
          callPromise = telephony.dial(number, cardIndex);
        }

        callPromise.then((callObj) => {
          if (callObj instanceof TelephonyCall) { // regular call
            telephony.addEventListener('callschanged', function callschangedOnce() {
              resolve();
              telephony.removeEventListener('callschanged', callschangedOnce);
            });

            let dtmfToneGroups = this.getNumberAsDtmfToneGroups(originNumber);
            if (dtmfToneGroups.length > 1) {
              callObj.addEventListener('connected', function dtmfToneGroupPlayer() {
                callObj.removeEventListener('connected', dtmfToneGroupPlayer);
                self.playDtmfToneGroups(dtmfToneGroups, cardIndex);
              });
            }
          } else { // MMI call
            resolve();
            this.mmiHandler(callObj.result, number);
          }
        }).catch((errorName) => {
          reject();
          self.errorHandler({
            errorName: errorName,
            number: number,
            isEmergencyOnly: emergencyOnly
          });
        });
      };

      this.selectSIMSlotForDialing(number)
        .then((index) => dialWithCardIndex(index))
        .catch((err) => reject(err));*/
      reject();
    });
  }

  selectSIMSlotForDialing(number) {
    const defaultSIMSlot = 0;
    // When there's only one SIM-slot, use the default one.
    if (!SIMSlotManager.isMultiSIM()) {
      Promise.resolve(defaultSIMSlot);
    }
    // Start to treat as a DSDS device from here.
    /*return navigator.mozTelephony.getEccList()   // B2G-API
      .then((eccList) => eccList.includes(number))
      .then((isEmergencyNumber) => {
        if (isEmergencyNumber) {
          // Try to find the corresponding outgoing sim-slot
          // for emergency calls from a pre-defined map.
          const selection = slotToMakeEmergencyCalls.selectByCurrentStatus();
          return selection ? selection.outgoingCall : defaultSIMSlot;
        }
        // Regular calls will relies on react-sim-chooser.
        return Service.request('chooseSim', 'call');
      });*/
  }

  checkSpecialNumber(number) {
    let isSpecialNumber = true;

    switch (number) {
      case '*#06#': {
        this.listDeviceInfos('imei');
        break;
      }

      case '*#07#': {
        this.showSarValue();
        break;
      }

      case '*#2886#': {
        let activity = new MozActivity({
          name: 'mmitest'
        });
        activity.onerror = () => {
          console.warn('Could not launch mmitest');
        };
        break;
      }

      case '*#*#7469#*#*': {
        LaunchStore.launch('origin', 'app://diagnostics.jio.com');
        break;
      }

      case '*#*#5820#*#*': {
        LaunchStore.launch('origin', 'app://jiods.jio.com');
        break;
      }

      case '*#*#0574#*#*': {
        let activity = new MozActivity({
          name: 'logmanager'
        });
        activity.onerror = () => {
          console.warn('Could not launch logmanager');
        };
        break;
      }

      default: {
        if (this.debuggerRemoteMode) {
          switch (number) {
            case '*#*#2637643#*#*':
            case '*#8378269#': {
              let activity = new MozActivity({
                name: 'engmode'
              });
              activity.onerror = () => {
                console.warn('Could not launch eng mode');
              };
              break;
            }

            case '*#0606#': {
              this.listDeviceInfos('meid');
              break;
            }

            case '*#*#33284#*#*': {
              this.setDebuggerMode(true);
              break;
            }

            case '*#*#48233#*#*': {
              this.setDebuggerMode(false);
              break;
            }

            default: {
              isSpecialNumber = false;
              break;
            }
          }
        } else {
          isSpecialNumber = false;
        }
        break;
      }
    }

    return isSpecialNumber;
  }

  playDtmfToneGroups(dtmfToneGroups, cardIndex) {
    let self = this;

    // Remove the dialed number from the beginning of the array.
    dtmfToneGroups = dtmfToneGroups.slice(1);
    let length = dtmfToneGroups.length;

    // Remove the latest entries
    // from dtmfToneGroups corresponding to ',' characters not to play those pauses.
    let lastCommaIndex = length - 1;
    while ('' === dtmfToneGroups[lastCommaIndex]) {
      lastCommaIndex--;
    }
    dtmfToneGroups = dtmfToneGroups.slice(0, ++lastCommaIndex);
    length = dtmfToneGroups.length;

    let promise = Promise.resolve();
    let counter = 0;
    let pauses;

    // Traverse the dtmfToneGroups array.
    while (counter < length) {
      // Reset the number of pauses before each group of tones.
      pauses = 1;
      while ('' === dtmfToneGroups[counter]) {
        // Add a new pause for each '' in the dtmfToneGroups array.
        pauses++;
        counter++;
      }

      // Send a new group of tones as well as the pauses to play before it.
      promise = promise.then(
        self.playDtmfToneGroup.bind(null, dtmfToneGroups[counter++], pauses, cardIndex)
      );
    }
    return promise;
  }

  playDtmfToneGroup(toneGroup, pauses, cardIndex, pausesDuration = 3000) {
    /*return navigator.mozTelephony.sendTones(   // B2G-API
      toneGroup,
      pausesDuration * pauses, // DTMF_SEPARATOR_PAUSE_DURATION = 3000ms
      null, //  tone duration
      cardIndex
    );*/
  }

  errorHandler({
    errorName,
    number,
    isEmergencyOnly
  } = {}) {
    console.warn(`Dialer error handler: ${errorName}`);

    if ('BadNumberError' === errorName) {
      // TODO: in emergency app, the errorName should change to use 'EmergencyCallOnly'
      errorName = isEmergencyOnly ? 'NoNetwork' : 'RegularCall';
    }

    let _case = this.errorCases[errorName];

    if (!_case) {
      console.warn(`Unexpected dialer error: ${errorName}`);
      // default error message
      _case = {
        content: 'CallFailed'
      };
    }

    let dialogOption = Object.assign({
      type: 'alert',
      translated: false,
      noClose: false
    }, _case);

    if (dialogOption.containNumber) {
      dialogOption.header = toL10n(dialogOption.header, { number: number });
      dialogOption.content = toL10n(dialogOption.content, { number: number });
      dialogOption.translated = true;
    }

    Service.request('showDialog', dialogOption);
  }

  isValid(number) {
    return this.validExp.test(number);
  }

  getNumberAsDtmfToneGroups(number) {
    return number.split(',');
  }
}

const dialHelper = new DialHelper();

export default dialHelper;
