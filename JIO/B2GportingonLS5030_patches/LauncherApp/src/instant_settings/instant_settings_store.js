/* global MozActivity */

import BaseModule from 'base-module';
import SettingsManager from 'settings-manager';
import SIMSlotManager from 'simslot-manager';
import FlashlightHelper from '../util/flashlight_helper';
import LaunchStore from '../util/launch_store';
import * as utils from '../util/utils';

/**
 * setting property intro:
 * icon: sync with gaia-icon
 * isShortcut: for launch item without on / off state
 * title: header title
 * subTitle: item state info
 * order: order for different direction, set `-1` will be removed
 * observerSetting: observer from setting to update state
 * removed: set `true` will be remove
 * cskType: will returen type, `launch` type will close panel after action
 * csk: custom function for click
 */

class InstantSettingsStore extends BaseModule {
  name = 'InstantSettingsStore';

  oriSettings = [
    {
      name: 'volume',
      icon: 'sound-max',
      isShortcut: true,
      title: 'volume',
      order: {
        portrait: 7,
        landscape: 1
      },
      cskType: 'launch',
      csk: () => {
        new MozActivity({
          name: 'configure',
          data: {
            target: 'device',
            section: 'volume'
            // TODO: check volume type with `Service.query('SoundManager.currentChannel')`
          }
        });
      }
    },
    {
      name: 'brightness',
      icon: 'brightness',
      isShortcut: true,
      title: 'brightness',
      observerSetting: 'screen.brightness',
      subtitle: 'percentage-number',
      order: {
        portrait: 1,
        landscape: 2
      },
    },
    {
      name: 'flashlight',
      icon: 'flashlight-on',
      title: 'flashlight',
      removed: true,
      order: {
        portrait: 6,
        landscape: 6
      },
      cskType: 'toggle',
      csk: () => FlashlightHelper.toggle()
    },
    {
      name: 'camera',
      icon: 'camera',
      isShortcut: true,
      title: 'camera',
      order: {
        portrait: 2,
        landscape: 7
      },
      cskType: 'launch',
      csk: () => {
        LaunchStore.launch('manifestURL', 'app://camera.gaiamobile.org/manifest.webapp');
      }
    },
    {
      name: 'calculator',
      icon: 'calculator',
      isShortcut: true,
      title: 'calculator',
      order: {
        portrait: 5,
        landscape: -1
      },
      cskType: 'launch',
      csk: () => {
        LaunchStore.launch('manifestURL', 'app://calculator.gaiamobile.org/manifest.webapp');
      }
    },
    {
      name: 'airplane-mode',
      icon: 'airplane-mode',
      title: 'airplane-mode',
      observerSetting: 'airplaneMode.enabled',
      order: {
        portrait: 0,
        landscape: 5
      },
      cskType: 'toggle'
    },
    {
      name: 'wifi',
      icon: 'wifi-32px',
      title: 'wifi',
      observerSetting: 'wifi.enabled',
      removed: true,
      order: {
        portrait: 3,
        landscape: 0
      },
      cskType: 'toggle'
    },
    {
      name: 'location',
      icon: 'location-32px',
      title: 'location',
      observerSetting: 'geolocation.enabled',
      order: {
        portrait: 1,
        landscape: 4
      },
      cskType: 'toggle'
    },
    {
      name: 'network',
      icon: 'network-activity',
      title: 'cellular-data',
      observerSetting: 'ril.data.enabled',
      order: {
        portrait: 8,
        landscape: 3
      },
      cskType: 'toggle'
    },
    {
      name: 'bluetooth',
      icon: 'bluetooth-32px',
      title: 'bluetooth',
      removed: true,
      observerSetting: 'bluetooth.enabled',
      order: {
        portrait: 4,
        landscape: 4
      },
      cskType: 'toggle'
    },
    {
      name: 'wifi_hotspot',
      icon: 'wifi_hotspot',
      title: 'wifi_hotspot',
      observerSetting: 'tethering.wifi.enabled',
      order: {
        portrait: 4,
        landscape: 4
      },
      cskType: 'toggle' 
    },
    {
      name: 'battery_saver',
      icon: 'battery_saver',
      title: 'battery_saver',
      observerSetting: 'powersave.enabled',
      order: {
        portrait: 4,
        landscape: 4
      },
      cskType: 'toggle' 
    },
    {
      name: 'audio_alarm',
      icon: 'audio_alarm-32px',
      title: 'audio_alarm',
      observerSetting: 'audio.volume.alarm',
      order: {
        portrait: 4,
        landscape: 4
      },
      cskType: 'volume'
    },
    {
      name: 'audio_content',
      icon: 'audio_content-32px',
      title: 'audio_content',
      observerSetting: 'audio.volume.content',
      order: {
        portrait: 4,
        landscape: 4
      },
      cskType: 'volume'
    },
    {
      name: 'audio_notification',
      icon: 'audio_notification-32px',
      title: 'audio_notification',
      observerSetting: 'audio.volume.notification',
      order: {
        portrait: 4,
        landscape: 4
      },
      cskType: 'volume'
    },
    {
      name: 'audio_telephony',
      icon: 'audio_telephony-32px',
      title: 'audio_telephony',
      observerSetting: 'audio.volume.telephony',
      order: {
        portrait: 4,
        landscape: 4
      },
      cskType: 'volume'
    }

  ];

  mdmSettings = [
    {
      name: 'wifi',
      observerSetting: 'dm.wifi.quicksettings.ui'
    },
    {
      name: 'bluetooth',
      observerSetting: 'dm.bluetooth.quicksettings.ui'
    },
    {
      name: 'network',
      observerSetting: 'dm.data.quicksettings.ui'
    }
  ];

  constructor() {
    super();
    this.orderType = utils.isLandscape ? 'landscape' : 'portrait';
  }

  start() {
    let _orderType = this.orderType;
    this.settings = this.oriSettings
      .filter((i) => (-1 !== i.order[_orderType]))
      .sort((a, b) => (a.order[_orderType] - b.order[_orderType]));

    this.settings.forEach((setting) => {
      if (setting.observerSetting && !setting.removed) {
        this.initSettingObserver(setting);
      }
    });

    this.initSettingObserverForBrightness();

    // observer airplaneMode.status to disable/enable airplane-mode button
    SettingsManager.addObserver('airplaneMode.status', this);

    // feature detection: flashlight
   /* navigator.hasFeature && navigator.hasFeature('device.capability.torch').then((hasFlashlight) => {   // B2G-API
      if (!hasFlashlight) {
        return;
      }
      let _setting = this.getSetting('flashlight');
      _setting.removed = false;
      FlashlightHelper.on('ready', this.updateFlashlightState.bind(this));
      FlashlightHelper.on('change', this.updateFlashlightState.bind(this));
    });*/

    // feature detection: bluetooth
   /* navigator.hasFeature && navigator.hasFeature('device.capability.bt').then((hasBluetooth) => {  // B2G-API
      if (!hasBluetooth) {
        return;
      }

      // If phone is reboot and bluetooth adapter is null.
      // It need prepare to init bluetooth adapter for user experience.
      if (navigator.mozBluetooth != undefined && 
        !navigator.mozBluetooth.defaultAdapter) {
        navigator.mozBluetooth.onattributechanged = (evt) => {
          if (evt.attrs.includes('defaultAdapter')) {
            navigator.mozBluetooth.onattributechanged = null;
          }
        };
      }
      let _setting = this.getSetting('bluetooth');
      _setting.removed = false;
      this.initSettingObserver(_setting);
    });*/

    // feature detection: wifi
   /* navigator.hasFeature('device.capability.wifi').then((hasWifi) => {  // B2G-API
      if (!hasWifi) {
        return;
      }
      let _setting = this.getSetting('wifi');
      _setting.removed = false;
      this.initSettingObserver(_setting);
    });*/

    // Make sure MDM settings are init after the original settings.
    window.setTimeout(() => {
      this.mdmSettings.forEach((setting) => {
        this.initMDMSettingObserver(setting);
      });
    }, 0);

    this.emit('change');
  }

  initSettingObserver(setting) {
    console.log("Brighness value called");

    let notifier = {};
    notifier['screen.brightness'] = 1;
    SettingsManager.set(notifier).then(() => {
      console.log('[Launcher] instantSettingsStore setVolume setting :: ' + setting.name + ' value ::' + value);
    });


    SettingsManager.addObserver(setting.observerSetting, this);
    this[`_observe_${setting.observerSetting}`] = (value) => {
      let _setting = this.getSetting(setting.name);
      _setting.isActive = value;
      console.log('[Launcher] instantSettingsStore initSettingObserver :: '+ setting.name+' :: '+ value);
      if (setting.name === 'location') {
        setting.isDisabled = false;
      }
      if (true === value) {
        _setting.subtitle = 'on';
      } else if (false === value) {
        _setting.subtitle = 'off';
      } else {
        _setting.subtitle = value.toString();
      }
      if (setting.name === 'network') {
        _setting.isActive = value && this.hasReadySIMCard();
      }

      // Save settings for recovering from MDM changes.
      _setting.raw = Object.assign({}, _setting);
      this.emit('change');
    };
  }

  RedirecttoSettings()
  {
  var activity = new MozActivity({
  name: "configure",
  data: {
  target: 'device',
  section: 'wifi'
   }
  });

  activity.onsuccess = function() {
  console.log("success");
  location.href = "loaderScreen.html"; 
  };
  
  activity.onerror = function() {
  console.log(this.error);
  //alert("unable to changed the value");
  };
}




  initMDMSettingObserver(setting) {
    SettingsManager.addObserver(setting.observerSetting, this);
    this[`_observe_${setting.observerSetting}`] = (value) => {
      console.log('[Launcher] instantSettingsStore initMDMSettingObserver setting :: ' + setting + '  Value:: ' + value);
      if (!value) {
        return;
      }

      let _setting = this.getSetting(setting.name);
      _setting.dm = value;

      switch (value) {
        case 'show':
          _setting.removed = false;
          _setting.subtitle = _setting.raw.subtitle;
          break;
        case 'hide':
          _setting.removed = true;
          _setting.subtitle = _setting.raw.subtitle;
          break;
        case 'gray':
          _setting.removed = false;
          _setting.subtitle = 'disabled';
          break;
        default:
          break;
      }

      this.emit('change');
    };
  }

  initSettingObserverForBrightness() {
    SettingsManager.addObserver('screen.brightness', this);
    this['_observe_screen.brightness'] = (value) => {
      let _setting = this.getSetting('brightness');
      _setting.subtitleArgs = {
        number: value * 100
      };
      this.emit('change');
    };
  }

  '_observe_airplaneMode.status'(value) {
    console.log('[Launcher] instantSettingsStore _observe_airplaneMode status :: ' + value);
    let isBusy = ('enabling' === value || 'disabling' === value);
    let _setting = this.getSetting('airplane-mode');
    _setting.isDisabled = isBusy;
    this.emit('change');
  }

  updateFlashlightState() {
    let _setting = this.getSetting('flashlight');
    let _flashlightEnabled = FlashlightHelper.flashlightManager.flashlightEnabled;
    _setting.isActive = _flashlightEnabled;
    _setting.subtitle = _flashlightEnabled ? 'on' : 'off';
    this.emit('change');
  }

  hasReadySIMCard() {
    let slot = SIMSlotManager.getSlots().find(slot => {
      if (!slot.simCard) {
        return false;
      }
      return slot.getCardState() === 'ready';
    });
    return !!slot;
  }

  checkSimCardState() {
    let _networkSetting = this.getSetting('network');
    let _airplaneModeSetting = this.getSetting('airplane-mode');
    let hasReadySIMCard = this.hasReadySIMCard();
    _networkSetting.isDisabled = _airplaneModeSetting.isActive || !hasReadySIMCard;
    if (!hasReadySIMCard && _networkSetting.isActive) {
      this.toggleSetting(_networkSetting);
    }
    this.emit('change');
  }

  addSimCardObserver() {
    if (this.isSimCardObserverAdded) {
      return;
    }
    this.isSimCardObserverAdded = true;
    this.checkSimCardState();
    /*if (window.navigator) {  // B2G-API
      let conns = window.navigator.mozMobileConnections;
      if (conns) {
        Array.from(conns).forEach((conn) => {
          conn.addEventListener('voicechange', this);
        }, this);
      }
    }*/
  }

  removeSimCardObserver() {
    this.isSimCardObserverAdded = false;
   /* if (window.navigator) {           // B2G-API
      let conns = window.navigator.mozMobileConnections;
      if (conns) {
        Array.from(conns).forEach((conn) => {
          conn.removeEventListener('voicechange', this);
        }, this);
      }
    }*/
  }

  _handle_voicechange() {
    this.checkSimCardState();
  }

  getIndex(name) {
    let _index = this.settings.findIndex((setting) => setting.name === name);
    if (-1 === _index) {
      console.warn(`no matched index for __${name}__!`);
    }
    return _index;
  }

  getSetting(name) {
    let _setting = this.settings.find((setting) => setting.name === name);
    if (!_setting) {
      console.warn(`no matched setting for __${name}__!`);
    }
    return _setting;
  }

  toggleSetting(setting) {
    setting.isDisabled = true;
    this.emit('change');
    console.log('[Launcher] instantSettingsStore toggleSetting setting :: ' + setting.name);
    let _finally = () => {
      setting.isDisabled = false;
      this.emit('change');
    };

    SettingsManager.get(setting.observerSetting).then((value) => {
      let notifier = {};
      notifier[setting.observerSetting] = !value;
      console.log('[Launcher] instantSettingsStore toggleSetting setting :: ' + setting.name + ' value ::' + value);
      SettingsManager.set(notifier).then(() => {
        console.log('[Launcher] instantSettingsStore toggleSetting set notifier setting :: ' + setting.name );
        switch (setting.name) {
          case 'airplane-mode':
            // airplane-mode will control `isDisabled` state by itself
            break;
          case 'bluetooth':
            utils.toggleBletooth(!value ? 'enable' : 'disable').then(
              () => _finally(),
              (reason) => {
                _finally();
                console.warn(reason);
              }
            );
            break;
          default:
            _finally();
            break;
        }
      });
    });
  }

  setVolume(type, value) {
    let _setting = this.getSetting(type);
    console.log("_setting.name"+_setting.name + "  _setting.isDisabled " + _setting.isDisabled)
    if (!_setting || _setting.isDisabled) {
      return;
    }
    let notifier = {};
    notifier[_setting.observerSetting] = value;
    SettingsManager.set(notifier).then(() => {
      console.log('[Launcher] instantSettingsStore setVolume setting :: ' + setting.name + ' value ::' + value);
    });
  }

  click(name) {
    console.log('[Launcher] instantSettingsStore click name :: ' + name);
    let _setting = this.getSetting(name);
    console.log('[Launcher] instantSettingsStore click _setting :: ' + _setting.isDisabled);
    if (!_setting || _setting.isDisabled) {
      return;
    }
    console.log('[Launcher] instantSettingsStore click _setting :: ' + _setting.observerSetting + ' setting.cskType ' + _setting.cskType);
    if ('toggle' === _setting.cskType && _setting.observerSetting) {
      this.toggleSetting(_setting);
    } else if (_setting.csk) {
      _setting.csk();
      return _setting.cskType;
    }
  }
}

const instantSettingsStore = new InstantSettingsStore();
instantSettingsStore.start();

export default instantSettingsStore;
