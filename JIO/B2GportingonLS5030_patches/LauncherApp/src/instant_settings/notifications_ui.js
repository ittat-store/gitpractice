import React from 'react';
import BaseComponent from '../base_component';
import EnhanceAnimation from 'enhance-animation';
import SoftKeyStore from 'soft-key-store';
import Service from 'service';
import InstantSettingsStore from './instant_settings_store';
import LaunchStore from '../util/launch_store';
import * as utils from '../util/utils';

import Clock from '../clock';

import './notifications.scss';

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


class Notifications extends BaseComponent {
  name = 'Notifications';

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

    this.state = {
      settings: InstantSettingsStore.settings,
      focusIndex: this.initIndex
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.setRef = this.setRef.bind(this);
  }

  componentDidMount() {
    this.icons = this.element.getElementsByClassName(iconClassName);
    this.updateSettings();
    InstantSettingsStore.on('change', this.updateSettings.bind(this));
  }

  componentDidUpdate() {
    this.focusIfPossible();
    this.updateSoftKey();
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
    this.setState((prevState) => {
      prevState.settings = InstantSettingsStore.settings.filter((setting) => !setting.removed);
      this.initIndex = (Math.ceil(prevState.settings.length / this.props.col) - 1) * this.props.col;
      return prevState;
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
    Service.request('closeSheet', 'notifications');
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

  closeNotices(){
    console.log("You have clicked the close button");
    Service.request('closeSheet','notifications');
  }
  closeContent(){
    console.log("You have clicked the msg close button");
    var msg=document.getElementById('first_notice_box');
    msg.style.display='none';
   }
  closeMsg(){
    console.log("You have clicked the msg close button");
    var msg=document.getElementById('app_msg_box');
    msg.style.display='none';
  }


  render() {
    return (  
        <div className='notices_container notifications' tabIndex="-1" role="heading" 
              aria-labelledby="instantSettings-title"
              onKeyDown={this.onKeyDown}
              onFocus={this.onFocus}
              ref={this.setRef}>

       {/*Top items - Lock, Clock*/}
        <div className='lock_section'>
          <img className='unlock_icon' src='images/unlock_icon.png'/>
        </div>
        <div className='clock_section'><Clock/></div>

        <div className='notices_section'>

        <div id='first_notice_box'>
        <div className='top_menu'>
        <div className='left_side'><span className='app_name_text'>Notification Center</span></div>
        <div className='right_side' onClick={this.closeContent}><img src='images/close_x.png'/></div>
        </div>

        <div className='notice_content'>
        <div className='left_part'><div className='circle_blue'></div></div>
        <div className='right_part'>
          <div className='app_name'>App Name</div><div className='time_part'>12:04</div>
          <div className='person_name'>John Doe</div>
          <div className='notice_desc'>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
              sed diam nonummy nibh euismod tincidunt ut laoreet dolore.</div>
        </div>
        </div>
        </div>


    <div  id='app_msg_box' className='msg_box still_more'>

    <div className='top_menu'>
     <div className='left_side'><span className='app_name_text'>App Name</span></div>
     <div className='right_side'><img src='images/up_arrow_half.png'/>
          <span className='show_less_text'>Show less</span>
          <img onClick={this.closeMsg} src='images/close_x.png'/>
     </div>
    </div>

    <div className='notice_content'>
    <div className='left_part'><div className='circle_blue'></div></div>
    <div className='right_part'>
      <div className='app_name'>App Name</div><div className='time_part'>12:04</div>
      <div className='person_name'>John Doe</div>
      <div className='notice_desc'>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
          sed diam nonummy nibh euismod tincidunt ut laoreet dolore.</div>
    </div>
    </div>
      <div className='notice_content'>
      <div className='left_part'><div className='circle_blue'></div></div>
      <div className='right_part'>
        <div className='app_name'>App Name</div><div className='time_part'>12:04</div>
        <div className='person_name'>John Doe</div>
        <div className='notice_desc'>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
            sed diam nonummy nibh euismod tincidunt ut laoreet dolore.
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
        </div>
      </div>
      </div> 
</div>

</div>

{/*Bottom tab bars */}
<div className='tab_bars'>
  <hr className='first_bar' onClick={this.closeNotices}></hr>
  <hr className='second_bar' onClick={this.closeNotices}></hr>
  <hr className='third_bar'></hr>
</div>     

</div>      
    );
  }
}
export default EnhanceAnimation(Notifications, 'immediate', 'immediate');
