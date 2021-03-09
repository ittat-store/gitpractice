import React from 'react';
import BaseComponent from './base_component';
import SoftKeyStore from 'soft-key-store';
import Clock from './clock';
import AppList from './app_list';
import Service from 'service';
import HomescreenTicker from './homescreen_ticker'
//import SpeedDialHelper from 'speed_dial_helper';
//import FlashlightHelper from 'util/flashlight_helper';
import LaunchStore from './util/launch_store';
import '../style/scss/main_view.scss';

export default class MainView extends BaseComponent { 

  name = 'MainView';

  static defaultProps = {
    open: null,
    close: null
  };
  static propTypes = {
    open: React.PropTypes.func,
    close: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.longPressDuration = 1500; // ms
    
    console.log('[Launcher] MainView constructor');
    window.addEventListener('visibilitychange', () => {
      console.log('[Launcher] MainView visibilitychange ' + document.hidden);
      if (document.hidden) {
        this._longPressActionTriggered = false;
      }
    });
  }

  componentDidMount() {
    Service.register('show', this);
    Service.register('hide', this);
    console.log('[Launcher] MainView componentDidMount ');
    SoftKeyStore.register({
      left: 'notifications',
      center: 'icon=all-apps',
      right: 'contacts'
    }, this.element); //Commented
    //SpeedDialHelper.register(this.element); commented 
    //AppList.register(this.element);
   /* setTimeout(function(){

      Service.request('openSheet', 'appList');
    }, 120000);*/
    Service.request('openSheet', 'appList');

  }

  show() {
    console.log('[Launcher] MainView show ');
    this.element.classList.remove('hidden');
    this.focus();
  }

  hide() {
    console.log('[Launcher] MainView hide ');
    this.element.classList.add('hidden');
  }

  focus() {
    console.log('[Launcher] MainView focus ');
    this.element.focus();
  }


  onKeyDown(evt) {
    //if ('complete' !== document.readyState || Service.query('LaunchStore.isLaunching')) {
    if ('complete' !== document.readyState) {
      return;
    }
    let key = evt.key;

    if (this._longPressTimer) {
      return;
    }
    console.log('[Launcher] MainView onKeyDown key:: ' + key);
    this._longPressTimer = setTimeout(() => {
      this.clearLongPressTimer();
      this._longPressActionTriggered = true;
      // For preloaded apps, the manifestURL for production and sit is different.
      // Use origin to launch app instead of manifestURL.
      switch (key) {
        case 'Enter':
          //LaunchStore.launch('origin', 'app://assistant.google.com'); commented
          break;
        case 'SoftLeft':
          //LaunchStore.launch('origin', 'app://jiopay.jio.com', 'lsk'); commented
          break;
        case 'SoftRight':
          //LaunchStore.launch('origin', 'app://myjio.jio.com'); commented
          break;
        case this.keyToTriggerFlashLight:
          //FlashlightHelper.toggle(); commented
          break;
        case 'Call':
          //LaunchStore.launch('origin', 'app://jiovideocall.jio.com'); commented
          break;
        default:
          this._longPressActionTriggered = false;
          break;
      }
    }, this.longPressDuration);
  }

  onKeyUp(evt) {
    let key = evt.key;
    //if (!this._longPressTimer || Service.query('LaunchStore.isLaunching')) {
    if (!this._longPressTimer) {
      return;
    }
    this.clearLongPressTimer();

    if (this._longPressActionTriggered) {
      this._longPressActionTriggered = false;
      return;
    }

    switch (key) {
      case 'Call':
        //LaunchStore.launch('manifestURL', 'app://communications.gaiamobile.org/manifest.webapp');commented
        break;
      case 'Enter':
        //Service.request('openSheet', 'appList'); commented
        break;
      case 'SoftLeft':
        //LaunchStore.launch('iac', ''); commented
        break;
      case 'SoftRight':
        //LaunchStore.launch('manifestURL', 'app://contact.gaiamobile.org/manifest.webapp'); commented
        break;
      case 'ArrowUp':
        //Service.request('openSheet', 'instantSettings'); commented
        break;
      case 'ArrowDown':
        //LaunchStore.launch('iac', 'launch-latest-content-player'); commented
        break;
      case 'ArrowLeft':
        //LaunchStore.launch('origin', 'app://jiomessages.rjil.com'); commented
        break;
      case 'ArrowRight':
        //LaunchStore.launch('manifestURL', 'app://camera.gaiamobile.org/manifest.webapp'); commented
        break;
      case 'Backspace':
        // if we quickly press Backspace after launch something, it might not trigger blur event.
        /*if (LaunchStore.isLaunching) {
          LaunchStore.isLaunching = false;
        }*/
        break;
      default:
        break;
    }
  }

  launchNotification() {
    LaunchStore.launch('iac', 'notice'); 
  }

  clearLongPressTimer() {
    if (this._longPressTimer) {
      clearTimeout(this._longPressTimer);
      this._longPressTimer = null;
    }
  }

  /*extends BaseComponent {


 name = 'MainView';

  static defaultProps = {
    open: null,
    close: null
  };
  static propTypes = {
    open: React.PropTypes.func,
    close: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.longPressDuration = 1500; // ms
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.keyToTriggerFlashLight = 'ArrowUp';
    console.log('[Launcher] MainView constructor');
    window.addEventListener('visibilitychange', () => {
      console.log('[Launcher] MainView visibilitychange ' + document.hidden);
      if (document.hidden) {
        this._longPressActionTriggered = false;
      }
    });

    // QWERTY device use space key to trigger flashlight
    navigator.hasFeature('device.capability.qwerty').then((isQwerty) => {
      if (isQwerty) {
        this.keyToTriggerFlashLight = ' ';
      }
    });

    window.performance.mark('navigationInteractive');
  }

  componentDidMount() {
    Service.register('show', this);
    Service.register('hide', this);
    console.log('[Launcher] MainView componentDidMount ');
   /* SoftKeyStore.register({
      left: 'notifications',
      center: 'icon=all-apps',
      right: 'contacts'
    }, this.element);//Commented
    //SpeedDialHelper.register(this.element); commented 

    //AppList.register(this.element);

    //Service.request('openSheet', 'appList'); cpmmented 

  }

  onKeyDown(evt) {
    //if ('complete' !== document.readyState || Service.query('LaunchStore.isLaunching')) {
    if ('complete' !== document.readyState) {
      return;
    }
    let key = evt.key;

    if (this._longPressTimer) {
      return;
    }
    console.log('[Launcher] MainView onKeyDown key:: ' + key);
    this._longPressTimer = setTimeout(() => {
      this.clearLongPressTimer();
      this._longPressActionTriggered = true;
      // For preloaded apps, the manifestURL for production and sit is different.
      // Use origin to launch app instead of manifestURL.
      switch (key) {
        case 'Enter':
          //LaunchStore.launch('origin', 'app://assistant.google.com'); commented
          break;
        case 'SoftLeft':
          //LaunchStore.launch('origin', 'app://jiopay.jio.com', 'lsk'); commented
          break;
        case 'SoftRight':
          //LaunchStore.launch('origin', 'app://myjio.jio.com'); commented
          break;
        case this.keyToTriggerFlashLight:
          //FlashlightHelper.toggle(); commented
          break;
        case 'Call':
          //LaunchStore.launch('origin', 'app://jiovideocall.jio.com'); commented
          break;
        default:
          this._longPressActionTriggered = false;
          break;
      }
    }, this.longPressDuration);
  }

  onKeyUp(evt) {
    let key = evt.key;
    //if (!this._longPressTimer || Service.query('LaunchStore.isLaunching')) {
    if (!this._longPressTimer) {
      return;
    }
    this.clearLongPressTimer();

    if (this._longPressActionTriggered) {
      this._longPressActionTriggered = false;
      return;
    }

    switch (key) {
      case 'Call':
        //LaunchStore.launch('manifestURL', 'app://communications.gaiamobile.org/manifest.webapp');commented
        break;
      case 'Enter':
        //Service.request('openSheet', 'appList'); commented
        break;
      case 'SoftLeft':
        //LaunchStore.launch('iac', 'notice'); commented
        break;
      case 'SoftRight':
        //LaunchStore.launch('manifestURL', 'app://contact.gaiamobile.org/manifest.webapp'); commented
        break;
      case 'ArrowUp':
        //Service.request('openSheet', 'instantSettings'); commented
        break;
      case 'ArrowDown':
        //LaunchStore.launch('iac', 'launch-latest-content-player'); commented
        break;
      case 'ArrowLeft':
        //LaunchStore.launch('origin', 'app://jiomessages.rjil.com'); commented
        break;
      case 'ArrowRight':
        //LaunchStore.launch('manifestURL', 'app://camera.gaiamobile.org/manifest.webapp'); commented
        break;
      case 'Backspace':
        // if we quickly press Backspace after launch something, it might not trigger blur event.
        if (LaunchStore.isLaunching) {
          LaunchStore.isLaunching = false;
        }
        break;
      default:
        break;
    }
  }

  clearLongPressTimer() {
    if (this._longPressTimer) {
      clearTimeout(this._longPressTimer);
      this._longPressTimer = null;
    }
  }

  show() {
    this.element.classList.remove('hidden');
    this.focus();
  }

  hide() {
    this.element.classList.add('hidden');
  }

  focus() {
    this.element.focus();
  }

  /*render() {
    console.log('[Launcher] MainView render ');
    return (
      <div
        id="main-view" tabIndex="-1"
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}        
        ref={(node) => { this.element = node; }}
      >
        {/* <Clock />*/ /*}
      </div>
    );
  }*/

  render() {
    console.log('[Launcher] MainView render ');
    return (
      <div
        id="main-view" tabIndex="-1"       
        ref={(node) => { this.element = node; }}
      >  
      <Clock />
      <HomescreenTicker />
      
      </div>
    );
  }

}


