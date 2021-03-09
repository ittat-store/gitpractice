
import React from 'react';
import BaseComponent from './base_component';
import ManifestHelper from 'manifest_helper';
//import FavoriteStore from 'favorite_store';
import Service from 'service';
import * as utils from './util/utils';

class AppStore extends BaseComponent {
  bartypeApps = [
    'Communications/call_log',
    'Contact',
    'KaiOS Plus',
    'JioShare',
    'WhatsApp',
    'Camera',
    'JioTV',
    'JioMusic',
    'Facebook',
    'Assistant',
    'JioCinema',
    'JioGames',
    'JioXpressNews',
    'FM Radio',
    'Clock',
    'Gallery',
    'Calendar',
    'Calculator',
    'Settings',
    'Browser',
    'Unit Converter',
    'Music',
    'Video',
    'Note',
    'JioChat',
    'JioVideoCall',
    'MyJio',
    'FileManager',
    'Messages',
    'Call Recording'
  ]

  qwertyApps = [
    'Communications/call_log',
    'Contact',
    'KaiOS Plus',
    'JioShare',
    'WhatsApp',
    'Camera',
    'JioTV',
    'Facebook',
    'Assistant',
    'JioMusic',
    'JioCinema',
    'JioXpressNews',
    'JioGames',
    'FM Radio',
    'Clock',
    'Gallery',
    'Calendar',
    'Calculator',
    'Settings',
    'Browser',
    'JioChat',
    'Unit Converter',
    'Music',
    'Video',
    'Note',
    'FileManager',
    'JioVideoCall',
    'MyJio',
    'Messages',
    'Call Recording'
  ]

  appObject = {
    name:'',
    manifestURL:''
  };


  constructor() {
    super();
    this.isRefreshing = false;
    console.log('[Launcher] AppStore constructor');
    this.init = () => {
      /*navigator.hasFeature('device.capability.qwerty').then((isQwerty) => {   // B2G-API
        this.installedApps = new Map();
        this.apps = [];
        this.hotTrayApps = [];
        this.hotTrayAppsName = JSON.parse(localStorage.getItem('hotTrayAppsName')) || 
          ['Camera', 'Callscreen', 'Browser','Messages'];//
        this.appNameList = [];
        this.orderedApps = isQwerty ? this.qwertyApps : this.bartypeApps;
        this.ready = false;
      });*/
    };

    this.init();
  }

  getAppIconUrl(app, icons) {
    icons = icons || app.manifest.icons;
    if (!icons) {
      return null;
    }
    console.log('[Launcher] AppStore getAppIconUrl');
    // we will try to get the smallest size icon which is bigger than 56px
    let iconUrl = icons[this.getAppIconSize(icons)];
    if (!/^(http|data)/.test(iconUrl)) {
      iconUrl = app.origin + iconUrl;
    }
    return iconUrl;
  }

  getAppIconSize(icons) {
    // we will try to get the smallest size icon which is bigger than 56px
    return Object.keys(icons).sort((a, b) => (a - b) * (a >= 56 ? 1 : -1))[0];
  }

  getAppIndex(mozApp) {
    console.log('[Launcher] AppStore getAppIndex');
    return this.apps.findIndex((_app) =>
      _app.manifestURL === mozApp.manifestURL
    );
  }

  updateAppIcon(mozApp) {
    console.log('[Launcher] AppStore updateAppIcon');
    return new Promise((resolve, reject) => {
      const index = this.getAppIndex(mozApp);
      // can't find the app, the icon of the app will not be updated.
      if (index < 0) resolve();

      const app = this.apps[index];
      const iconSize = this.getAppIconSize(app.manifest.icons);

      /*navigator.mozApps.mgmt.getIcon(mozApp, iconSize) // B2G-API
        .then((blob) => {
          app.icon_url = URL.createObjectURL(blob);
          resolve();
        })*/
        /*.catch((error) => {
          reject(error);
        });*/
    });
  }

  checkImage(app, prop, fallbackUrl) {
    console.log('[Launcher] AppStore checkImage');
    let i = new Image();
    i.src = app[prop];
    i.onerror = () => {
      app[prop] = fallbackUrl;
      this.emit('change');
    };
  }

  addApp(app, mozApp) {
    let icons = app.manifest.icons;
    console.log('[Launcher] AppStore addApp');
    if (icons) {
      app.icon_url = this.getAppIconUrl(app, icons);

      if (/^http/.test(app.icon_url)) {
        this.checkImage(app, 'icon_url', './style/images/default_app_56.png');
      }
    }

    app.launch = () => {
      window.performance.mark(`appLaunch@${app.origin}`);
      mozApp.launch(app.entry);
    };
    app.shouldHide = (() => {
      return (
        !app.enabled ||
        'dialer' === app.entry ||
        ['system', 'input', 'theme', 'homescreen', 'invisible'].includes(app.manifest.role) ||
        ['invisible'].includes(app.role)
      );
    })();

    app.mozApp = mozApp;
    app.uid = this.getAppUid(app);

    // For fast search
    this.installedApps.set(this.getAppUid(app), app);

    // order
    if (/^app:/.test(app.origin)) {
      let key = app.manifest.name;
      if (app.entry) {
        key += `/${app.entry}`;
      }
      let index = this.orderedApps.indexOf(key);
      app.order = (-1 === index) ? 99 : index;
    } else {
      app.order = 999;
    }

    app.theme = app.manifest.theme_color || null;

    let matchedIndex;
    this.apps.some((_app, index) => {
      let matched = (_app.manifestURL === app.manifestURL);
      if (matched) {
        matchedIndex = index;
      }
      return matched;
    });
    if (undefined !== matchedIndex) {
      this.apps[matchedIndex] = app;
    } else {
      this.apps.push(app);
    }
    this.appNameList.push(app.name);
    //console.log('[Launcher]  Parse App AppName:: ' + app.name);
    
    console.log('[Launcher]  Parse App AppName Tray Length:: ' + this.hotTrayAppsName.length);
    console.log('[Launcher]  Parse App AppName Tray apps :: ' + JSON.stringify(this.hotTrayAppsName));
    
    if (this.hotTrayAppsName.includes(app.name)) {
      this.hotTrayApps.push(app);
      console.log('[Launcher]  Parse App AppName Tray Length:: ' + this.hotTrayApps.length);
      console.log('[Launcher]  Parse App AppName:: ' + this.hotTrayApps[this.hotTrayApps.length -1].name);
    }
    localStorage.setItem('hotTrayAppsName', JSON.stringify(this.hotTrayAppsName));
  }

  setHotSeatApps(app, position) {
    this.hotTrayAppsName.pop();
    position ? this.hotTrayAppsName.insert(position, app.name) :
      this.hotTrayAppsName.push(app.name);
    localStorage.setItem('hotTrayAppsName', JSON.stringify(this.hotTrayAppsName));
    this.hotTrayApps.pop();
    position ? this.hotTrayApps.insert(position, app) :
      this.hotTrayApps.push(app);

  }

  toggle(manifestURL, entry) {
    // /*let app = this.installedApps.get(this.getAppUid({ manifestURL, entry }));
    // delete app.favorOrder;
    // FavoriteStore.toggle(manifestURL, entry);*/
  }

  getAppNameList() {
    return this.appNameList;
  }

  query(manifestURL, entry) {
    if (!this.ready) {
      return null;
    }

    return this.apps.find((app) => {
      if (app.manifestURL === manifestURL) {
        if (!entry) {
          return true;
        } else if (entry && app.entry === entry) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }, this);
  }

  parse(mozApp) {
    console.log('[Launcher] AppStore parse');
    var app;
    // the manifest info of webapp with downloaded manifest is in mozApp.updateManifest
    var manifest = mozApp.manifest || mozApp.updateManifest;
    // Entry point app
    var entryPoints = manifest.entry_points;
    // Only use entryPoints for Call log app(communications).
    var isCommunications = (
      mozApp.manifestURL === 'app://communications.gaiamobile.org/manifest.webapp'
    );
    if (entryPoints && isCommunications) {
      let name = '';
      // Do deep copy to avoid reference to be overwritten
      // only when we're entry points.
      manifest = JSON.parse(JSON.stringify(manifest));

      for (let ep in entryPoints) {
        app = {};
        let currentEp = entryPoints[ep];

        name = new ManifestHelper(currentEp).name;
        for (let key in currentEp) {
          if (key !== 'locale' && key !== 'name') {
            manifest[key] = currentEp[key];
          }
        }
        for (let key in mozApp) {
          app[key] = mozApp[key];
        }
        app.manifest = manifest;
        app.name = name;
        app.entry = ep;
        this.addApp(app, mozApp);
      }
    } else {
      app = {};
      for (let key in mozApp) {
        app[key] = mozApp[key];
      }
      // updateManifest for installPackaged type app
      if (!app.manifest) {
        app.manifest = app.updateManifest;
      }
      app.name = new ManifestHelper(app.manifest).name;
      this.addApp(app, mozApp);
    }
    //console.log('[Launcher]  Parse App AppName:: ' + app.name);
    //console.log('[Launcher]  Parse App App ' + app.name + '   menifest '+ JSON.stringify(app.manifest));
  }
  getAppUid(app) {
    let _uid = app.manifestURL;
    if (app.entry) {
      _uid += `+${app.entry}`;
    }
    return _uid;
  }
  sort() {
    //let totalFavor = FavoriteStore.favorites.length;
    console.log('[Launcher] AppStore sort');
    /*FavoriteStore.favorites.forEach((favor, index) => {
      let _favorApp = this.installedApps.get(this.getAppUid(favor));
      if (!_favorApp && favor.manifestURL.match(FavoriteStore.jioDevPatterns)) {
        console.warn('old favor need to update after fota.');
        let _fotaFavor = {
          ...favor,
          manifestURL: FavoriteStore.getFotaManifestURL(favor.manifestURL)
        };
        _favorApp = this.installedApps.get(this.getAppUid(_fotaFavor));
        // remove old favor
        FavoriteStore.toggle(favor.manifestURL, favor.entry);
        // add new favor
        FavoriteStore.toggle(_fotaFavor.manifestURL, _fotaFavor.entry);
        this.reSortByOrder();
      }

      if (_favorApp) {
        _favorApp.favorOrder = index - totalFavor;
      } else {
        console.warn('non-matched favor');
        FavoriteStore.toggle(favor.manifestURL, favor.entry);
        this.reSortByOrder();
      }
    }, this);
    this.reSortByOrder();*/
  }

  reSortByOrder() {
    /*this.apps.sort((a, b) => {
      return (a.favorOrder || a.order) > (b.favorOrder || b.order);
    });
    this.emit('change');*/
  }
  update() {
    /*this.apps.forEach((app) => {
      app.isFavorite = FavoriteStore.favorites.some((favor) => {
        return (this.getAppUid(app) === this.getAppUid(favor));
      });
    });*/

    this.emit('change');
  }
  start() {
    console.log('[Launcher] AppStore start');
    //let appMgmt = navigator.mozApps.mgmt;  // B2G-API
   /* if (!appMgmt) {
      return;
    }*/
    this.firstTime = true;
    /*FavoriteStore.on('change', () => {
      if (this.firstTime) {
        this.firstTime = false;
        this.update();
        this.sort();
      } else {
        this.update();
      }
    });*/

    this.updateMgmt();
    window.addEventListener('localized', this);

    // regesiter event for re-run this.start() when app-installed & app-uninstalled
    //appMgmt.addEventListener('update', this);
    //appMgmt.addEventListener('install', this);
    //appMgmt.addEventListener('uninstall', this);
    //appMgmt.addEventListener('enabledstatechange', this);
  }

  updateMgmt() {
    let self = this;
    console.log('[Launcher] AppStore updateMgmt');
    /*navigator.mozApps.mgmt.getAll().onsuccess = function mozAppGotAll(evt) {   // B2G-API
      var apps = evt.target.result;
      apps.forEach((app) => {
        // pending --> installed <---> updating
        if ('pending' === app.installState) {
          return;
        }
        self.parse(app);
        app.ondownloadapplied = (_evt) => {
          self.parse(_evt.application);
          self.emit('change');
        };
      });

      //FavoriteStore.start();

      self.ready = true;
      self.emit('ready');
    };*/
  }

  removeApp(app) {
    let targetAppUid = this.getAppUid(app);
    console.log('[Launcher] AppStore removeApp');
    this.apps.some((_app, index) => {
      if (_app.uid === targetAppUid) {
        this.apps.splice(index, 1);
        this.emit('change', { type: 'remove' });
        return true;
      } else {
        return false;
      }
    });
  }

  uninstallApp(app) {
    console.log('[Launcher] AppStore uninstallApp');
    Service.request('showDialog', {
      type: 'confirm',
      header: 'confirmation',
      content: utils.toL10n('confirm-to-uninstall-app', { appName: app.manifest.name }),
      translated: true,
      onOk: () => {
        //navigator.mozApps.mgmt.uninstall(app);  // B2G-API
      }
    });
  }

  _handle_update(evt) {
    const mozApp = evt.application;

    this.parse(mozApp);
    this.updateAppIcon(mozApp)
      .then(() => {
        this.emit('change', { type: 'update' });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _handle_install(evt) {
    let app = evt.application;
    if ('installed' === app.installState) {
      this.parse(app);
      this.emit('change', { type: 'install' });
      return;
    }
    app.ondownloadapplied = () => {
      this.parse(app);
      this.emit('change', { type: 'ondownloadapplied' });
    };
    app.ondownloaderror = () => {
      console.error('App download fail.');
    };
  }

  _handle_uninstall(evt) {
    this.removeApp(evt.application);
  }

  _handle_enabledstatechange(/* evt */) {
    // We will refresh the entire AppStore when enabledstatechange triggered.
    // It may cause the AppList lost its focus because there have no app could
    // hold the focus during the refreshing process. Thus we need to set a flag
    // to ask AppList to get back focus when the refreshing is done.
    this.isRefreshing = true;
    this.init();
    this.updateMgmt();
  }

  _handle_localized() {
    this.apps.forEach((app) => {
      let _manifestObj = app.entry ? app.manifest.entry_points[app.entry] : app.manifest;
      app.name = new ManifestHelper(_manifestObj).name;
    });
    this.emit('change');
  }
}

const appStore = new AppStore();
appStore.start();

export default appStore;
