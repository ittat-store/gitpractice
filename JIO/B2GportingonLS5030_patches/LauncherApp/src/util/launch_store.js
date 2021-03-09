import BaseModule from 'base-module';
import Service from 'service';
import AppStore from '../app_store';

class LaunchStore extends BaseModule {
  name = 'LaunchStore';

  constructor(props) {
    super(props);
    this.ports = {};
    window.addEventListener('visibilitychange', this.resetLaunchingMarker);
    window.addEventListener('blur', this.resetLaunchingMarker);
    Service.registerState('isLaunching', this);
  }

  resetLaunchingMarker = () => {
    this.isLaunching = false;
  }

  launch(prop, value, entryPoint) {
    if (!prop || !value) {
      console.warn('wrong launching parameters');
      return;
    }
    if ('iac' === prop) {
      this.launchForIAC(value);
    } else {
      this.launchApp(prop, value, entryPoint);
    }

    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
      this.resetTimer = null;
    }
    this.resetTimer = setTimeout(this.resetLaunchingMarker, 3000);
  }

  launchApp(prop, value, entryPoint) {
    if (this.isLaunching) {
      return;
    }
    this.isLaunching = true;
    let matched = AppStore.apps.some((app) => {
      let _matched = (app[prop] === value);
      if (_matched) {
        // Use mozApp to launch app if target entryPoint is provided.
        if (entryPoint &&
          app.mozApp.manifest.entry_points &&
          app.mozApp.manifest.entry_points[entryPoint]) {
          app.mozApp.launch(entryPoint);
        } else {
          app.launch();
        }
      }
      return _matched;
    });

    if (!matched) {
      console.warn(`Can't find any app with ${prop}: ${value}!`);
    }
  }

  launchForIAC(appName) {
    if (this.isLaunching) {
      return;
    }
    if (!this.ports[appName]) {
      /*navigator.mozApps.getSelf().onsuccess = (appevt) => {  // B2G-API
        let app = appevt.target.result;
        app.connect(appName).then((ports) => {
          this.ports[appName] = ports;
          this.launchForIAC(appName);
        }, (reason) => {
          console.warn(`cannot use IAC: ${reason}`);
        });
      };*/
      return;
    } else {
      this.isLaunching = true;
    }

    this.ports[appName].forEach((port) => {
      port.postMessage({});
    });
  }
}

export default (new LaunchStore());
