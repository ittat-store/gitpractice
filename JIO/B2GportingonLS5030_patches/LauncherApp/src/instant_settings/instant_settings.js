import React from 'react';
import BaseComponent from '../base_component';
import EnhanceAnimation from 'enhance-animation';
import SoftKeyStore from 'soft-key-store';
import Service from 'service';
import InstantSettingsStore from './instant_settings_store';
import LaunchStore from '../util/launch_store';
import * as utils from '../util/utils';
import '../../style/scss/instant_settings.scss';
import AppLongPress from '../app_longpress';
import Hammer from 'hammerjs';

const iconClassName = 'instantSettings__icon';

function instantSettingItem(i) {
  let _className = [
    iconClassName,
    i.isActive ? 'is-active' : null,
    i.isShortcut ? 'is-shortcut' : null
  ].filter(Boolean).join(' ');

  return (
    <div key={i.name} className="instantSettings__tile">
      <button
        className={_className}
        aria-label={i.name}
        data-icon={i.icon}
        data-dm={i.dm}
      >
        <div className="instantSettings__info">
          <div className="instantSettings__title" data-l10n-id={i.title} />
          <div className="instantSettings__subtitle">{utils.toL10n(i.subtitle, i.subtitleArgs)}</div>
        </div>
      </button>
    </div>
  );
}


class InstantSettings extends BaseComponent {
  name = 'InstantSettings';

  static defaultProps = {
    col: 3,
    row: 3
  };

  static propTypes = {
    col: React.PropTypes.number,
    row: React.PropTypes.number
  };

  constructor(props) {
    super(props);

    window.is = this;
    window.InstantSettingsStore = InstantSettingsStore;

    this.initIndex = 0;
    this.isLongPress = false;

    this.state = {
      settings: InstantSettingsStore.settings,
      focusIndex: this.initIndex
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.setRef = this.setRef.bind(this);
    //this.state.settings
    console.log('[Launcher] InstantSettings settings length :: ' + this.state.settings.length);
    /*this.state.settings.forEach((setting) => {
      console.log(' [Launcher] InstantSettings settings:: ' + JSON.stringify(setting));
    });*/
  }

  componentDidMount() {

    if (this.element) {
      this.icons = this.element.querySelectorAll('.' + iconClassName);
      if (this.icons) {
        console.log('[Launcher] InstantSettings totla icons ' + this.icons.length);
      }
      this.appLongPress.hide();
    }
    this.updateSettings();
    InstantSettingsStore.on('change', this.updateSettings.bind(this));
    this.onSettingsClick = this.onSettingsClick.bind(this);

  }

  componentDidUpdate() {
    //this.focusIfPossible();
    //this.updateSoftKey();
    if (this.element) {
      this.registerPressEvent();
    }
  }

  registerPressEvent() {
    this.gesture = new Hammer(this.element);
    this.gesture.get('press').set({ time: 1000 });
    this.gesture.on('press', this.onIconPress.bind(this));
    this.gesture.on('pressup', this.onIconPressUp.bind(this));

  }

  unRegisterPressEvent() {
    this.gesture.off('press', this.onIconPress.unbind(this));
    this.gesture.off('pressup', this.onIconPressUp.unbind(this));
  }

  onIconPress(e) {
    console.log("[Launcher] InstantSettings onSettingsClick oniconpress " + e.target.id);
    this.isLongPress = true;
  }

  onIconPressUp(e) {
    console.log("[Launcher] InstantSettings onSettingsClick oniconpressup " + e.target.id);
    let self = this;
    setTimeout(() => {
      self.isLongPress = false;
    }, 500);
    switch(e.target.id) {
      case 'bluetooth':
      case 'wifi':
      case 'network':
      case 'location':
        this.settingsOpen(e.target.id);
        break;
      case 'camera':
        console.log("app_longpress component called "+e.target.id);
        let iconPressed = e.target.id;
        this.appLongPress.show(iconPressed);
        break;
    }
  }

  updateSoftKey() {
    let currentIndex = this.state.focusIndex;
    let currentSetting = this.state.settings[currentIndex];
    SoftKeyStore.register({
      left: '',
      center: currentSetting.isDisabled ? '' : 'icon=ok',
      right: 'settings'
    }, this.element);
  }

  updateSettings() {
    console.log('[Launcher] updateSettings called');
    this.setState((prevState) => {
      prevState.settings = InstantSettingsStore.settings.filter((setting) => !setting.removed);
      this.initIndex = (Math.ceil(prevState.settings.length / this.props.col) - 1) * this.props.col;
      this.updateAppIcons();
      return prevState;
    });
  }

  updateAppIcons() {
    console.log('[Launcher] InstantSettings updateAppIcons called');
    this.state.settings.forEach((setting) => {
      //console.log(' [Launcher] InstantSettings updateAppIcons settings:: ' + JSON.stringify(setting));
      if (('isActive' in setting) && ('subtitle' in setting)) {
        console.log('[Launcher] InstantSettings updateAppIcons name :: ' + setting.name);
        console.log('[Launcher] InstantSettings updateAppIcons isActive :: ' + setting.isActive);
        console.log('[Launcher] InstantSettings updateAppIcons subtitle :: ' + setting.subtitle);
        if (setting.subtitle === 'on' || setting.subtitle === 'off') {
          var ele = document.getElementById(setting.name);
          ele.setAttribute('data-icon', setting.name + "_" + setting.subtitle);
        }
        
      }
    });

  }

  onKeyDown(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    let key = evt.key;
    let currentIndex = this.state.focusIndex;

    switch (key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        this.handleNavGrid(currentIndex, key);
        break;
      case 'Enter':
        this.onCSK(currentIndex);
        break;
      case 'SoftRight':
        this.onRSK();
        break;
      case 'EndCall':
      case 'Backspace':
        this.exit();
        break;
      default:
        break;
    }
  }

  onFocus(evt) {
    // launch panel
    if (evt.target === this.element) {
      this.state.focusIndex = this.initIndex;
      this.focusIfPossible();

      /**
       * Observer sim card state by voicechange event to update network button state.
       * But voicechange event will be fired every 3 ~ 5 seconds,
       * so we will add observer when UI is focused, and remove observer when exit.
       */
      InstantSettingsStore.addSimCardObserver();
    }
  }

  onCSK() {
    let currentSetting = this.state.settings[this.state.focusIndex];
    if (currentSetting.isDisabled || currentSetting.dm === 'gray') {
      return;
    }
    let cskType = InstantSettingsStore.click(currentSetting.name);
    if ('launch' === cskType) {
      this.exit();
    }
  }

  onRSK() {
    LaunchStore.launch('manifestURL', 'app://settings.gaiamobile.org/manifest.webapp');
    this.exit();
  }

  handleNavGrid(currentIndex, key) {
    let newIndex = this.navGrid({
      currentIndex: currentIndex,
      dir: key,
      total: this.state.settings.length
    });
    // overflow case
    if (-1 === newIndex) {
      this.exit();
      return;
    }
    if (newIndex !== currentIndex) {
      // this.updateFocusIndex(newIndex);
      this.setState({
        focusIndex: newIndex
      });
    }
  }

  navGrid({ currentIndex = this.initIndex, dir, col = this.props.col, total } = {}) {
    let colMax = this.props.col - 1;
    let rowMax = this.props.row - 1;
    let [x, y] = [currentIndex % col, Math.floor(currentIndex / col)];
    let isRtl = utils.isRtl();
    let dirFactor = isRtl ? -1 : 1;
    switch (dir) {
      case 'ArrowRight':
        x = utils.clamp(x + dirFactor, 0, colMax);
        break;
      case 'ArrowLeft':
        x = utils.clamp(x - dirFactor, 0, colMax);
        break;
      case 'ArrowUp':
        y = utils.clamp(y - 1, 0, rowMax);
        break;
      case 'ArrowDown':
        // special case for checking overflow
        y += 1;
        break;
      default:
        break;
    }
    let nextIndex = (y * col) + x;
    if ('ArrowDown' === dir && nextIndex >= total) {
      return -1;
    } else {
      return utils.clamp(nextIndex, 0, total - 1);
    }
  }

  exit() {
    InstantSettingsStore.removeSimCardObserver();
    Service.request('closeSheet', 'instantSettings');
  }

  isHidden() {
    return !this.element.offsetParent;
  }

  focusIfPossible() {
    if (!this.element || this.isHidden()) {
      return;
    }

    let forcusTarget = this.element;
    if (this.icons) {
      forcusTarget = this.icons[this.state.focusIndex] || this.icons[this.initIndex];
    }
    forcusTarget.focus();
  }

  setRef(node) {
    this.element = node;
  }

  closeSettings() {
    console.log("you clicked the close button instant settings");

    document.getElementById("instant_settings_container").animate(
      [
        { transform: 'translateY(0px)' },
        { transform: 'translateY(-300px)' },
        { transform: 'translateY(-1200px)' }
      ],
      {
        duration: 1000,
        iterations: 1,
        fill: 'backwards'
      });

    setTimeout(() => {
      Service.request('closeSheet', 'instantSettings');
    }, 900);

  }

  onSettingsClick(e) {
    if (this.isLongPress) { return; }
    console.log("[Launcher] InstantSettings onSettingsClick " + e.target.id);
    let cskType = InstantSettingsStore.click(e.target.id);
    if ('launch' === cskType) {
      this.exit();
    }
  }

  onRangeSlider(e)
  {
      let value = e.target.id === "brightness" ? e.target.value/10 : e.target.value;

      console.log("onRangeSlider  log "+e.target.id + " volume"+ value );
      InstantSettingsStore.setVolume(e.target.id,value);


  }

  settingsOpen(sections) {

    var activity = new MozActivity({
      name: "configure",
      data: {
        target: 'device',
        section: sections
      }
    });

    activity.onsuccess = function () {
      console.log("success");
      //location.href = "loaderScreen.html"; 
    };

    activity.onerror = function () {
      console.log(this.error);
      //alert("unable to changed the value");
    };

  }


  render() {
    return (
      <div className='instant_settings_container'
        id='instant_settings_container'
        ref={(node) => { this.element = node; }} >

            <div className='music_container'>
              <row>
                <div className='ele music_text'>
              <div>  
               <img className='jio_music_icon' src='images/volume.png' />
               <span className='jio_music_text'>JioMusic</span>
               </div>
                  <div>Song Name Extension</div>
                  <div className='artist_name'>Artist Name</div>
              </div>
           <div>
             <img className='ele music_image' src='images/music_album_image.png'/>
           </div>  
            </row>
              <row>
                <div className='ele music_icons'>
                  <img src='images/backward_button.png' />
                  <img src='images/play_button.png' />
                  <img src='images/forward_button.png' />
                </div>
              </row>
            </div>

          <div className='icons_container'>
            <row>
              <div className='ele' >
                <div className='instantSettings__icon' id='airplane-mode' data-icon='airplane-mode_off' onClick={this.onSettingsClick} />
                <span className='icon_name'>Flight mode</span>
              </div>
              <div className='ele' >
                <div className='instantSettings__icon' id='network' data-icon='network_off' onClick={this.onSettingsClick} />
                <span className='icon_name'>Mobile Data</span>
              </div>
              <div className='ele' >
                <div className='instantSettings__icon' id='night-mode' data-icon='night-mode_off' onClick={this.onSettingsClick} />
                <span className='icon_name'>Dark/Light Mode</span>
              </div>
              <div className='ele' >
                <div className='instantSettings__icon' id='location' data-icon='location_off' onClick={this.onSettingsClick} />
                <span className='icon_name'>GPS</span>
              </div>
            </row>
            <row>
              <div className='ele' >
                <div className='instantSettings__icon' id='bluetooth' data-icon='bluetooth_off' onClick={this.onSettingsClick} />
                <span className='icon_name'>Bluetooth</span>
              </div>

              <div className='ele' >
                <div className='instantSettings__icon' id='wifi' data-icon='wifi_off' onClick={this.onSettingsClick} />
                <span className='icon_name'>Wifi</span>
              </div>

              <div className='ele' >
                <div className='instantSettings__icon' id='wifi_hotspot' data-icon='wifi_hotspot_off' onClick={this.onSettingsClick} />
                <span className='icon_name'>Wifi Hotspot</span>
              </div>

              <div className='ele' >
                <div className='instantSettings__icon' id='battery_saver' data-icon='battery_saver_off' onClick={this.onSettingsClick} />
                <span className='icon_name'>Battery Saver</span>
              </div>
            </row>
            <row>
              <div className='ele' >
                <div className='instantSettings__icon' id='screen_rotation' data-icon='screen_rotation' onClick={this.onSettingsClick} />
                <span className='icon_name'>Screen Rotation</span>
              </div>
              <div className='ele' >
                <div className='instantSettings__icon' id='child_mode' data-icon='child_mode' onClick={this.onSettingsClick} />
                <span className='icon_name'>Child Mode</span>
              </div>

              <div className='ele' >
                <div className='instantSettings__icon' id='do_not_disturb' data-icon='do_not_disturb' onClick={this.onSettingsClick} />
                <span className='icon_name'>Do Not Disturb</span>
              </div>

              <div className='ele' >
                <div className='instantSettings__icon' id='flashlight' data-icon='flashlight_off' onClick={this.onSettingsClick} />
                <span className='icon_name'>Torch</span>
           </div>
        </row>
     </div>

        <div className='bars_container'>

          <div className='bar_element'>
            <div className='indicator'>

              <div className='progress_bar first-bar mySliderItem'>
               <input className='bar-input' id="audio_alarm" step="NaN" max="15" min="0" class="style-scope kai-slider" type="range" onChange={this.onRangeSlider}></input>
              </div>
            </div>
            <img src='images/ringtone.png' />
          </div>
          <div className='bar_element'>
            <div className='indicator'>

              <div className='progress_bar first-bar mySliderItem'>

                <input className='bar-input'  id="audio_notification" step="NaN" max="15" min="0" class="style-scope kai-slider" type="range"  onChange={this.onRangeSlider}></input>

              </div>
            </div> <img src='images/alarm.png' />
          </div>
          <div className='bar_element'>
            <div className='indicator'>

              <div className='progress_bar first-bar mySliderItem'>


                <input className='bar-input' id="audio_telephony" step="NaN" max="5" min="0" class="style-scope kai-slider" type="range"  onChange={this.onRangeSlider}></input>

              </div>
            </div><img src='images/volume.png' />
          </div>
          <div className='bar_element'>
            <div className='indicator'>

              <div className='progress_bar first-bar mySliderItem'>


                <input className='bar-input'  id="audio_content" step="NaN" max="15" min="0" class="style-scope kai-slider" type="range" onChange={this.onRangeSlider}></input>

              </div>
            </div> <img src='images/brightness.png' />
          </div>

          <div className='bar_element'>
            <div className='indicator'>

              <div className='progress_bar first-bar mySliderItem'>


                <input className='bar-input' id="brightness" step="NaN" max="10" min="1" class="style-scope kai-slider" type="range" onChange={this.onRangeSlider}></input>

              </div>
            </div> <img src='images/brightness.png' />
          </div>

        </div>
        <div className='bottom_icons_container'>

          <div className='ele_bottom'>
            <div className='instantSettings__icon' data-icon='camera' id='clock' onClick={this.onSettingsClick} />
            <span className='icon_name'>Clock</span></div>
          <div className='ele_bottom'>
            <div className='instantSettings__icon' data-icon='calculator' id='calculator' onClick={this.onSettingsClick} />
            <span className='icon_name'>Calculator</span></div>
          <div className='ele_bottom'>
            <div className='instantSettings__icon' data-icon='camera' id='camera' onClick={this.onSettingsClick} />
            <span className='icon_name'>Camera</span></div>
          <div className='ele_bottom'>
            <div className='instantSettings__icon' data-icon='trashbin_off' id='mic' onClick={this.onSettingsClick} />
            <span className='icon_name'>Memory Cleaner</span></div>

        </div>
        <div className='tab_bars'>
          <hr className='first_bar' onClick={this.closeSettings}></hr>
          <hr className='second_bar' onClick={this.closeSettings}></hr>
          <hr className='third_bar'></hr>
        </div>
        <AppLongPress  ref={(ref) => (this.appLongPress = ref)}></AppLongPress>

      </div>

      

    );
  }
}

export default EnhanceAnimation(InstantSettings, 'immediate', 'immediate');
