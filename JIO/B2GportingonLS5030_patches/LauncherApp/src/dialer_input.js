/* global LazyLoader, TonePlayer */

import React from 'react';
import BaseComponent from 'base-component';
import Service from 'service';
import SoftKeyStore from 'soft-key-store';
import SettingsManager from 'settings-manager';
import fontFit from 'font-fit';
import * as utils from 'util/utils';
import Qwerty from 'util/qwerty';
import LaunchStore from './util/launch_store';

export default class DialerInput extends BaseComponent {
  name = 'DialerInput';
  SPECIAL_CHARS = ['*', '+', ','];

  static defaultProps = {
    dial: null,
    exitDialer: null,
    updateTelNum: null
  };

  static propTypes = {
    dial: React.PropTypes.func,
    exitDialer: React.PropTypes.func,
    updateTelNum: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.telNum = '';
    this.fontStyles = '';
    this.isVTSupported = false;

    LazyLoader.load(['shared/js/dialer/tone_player.js'],
      () => {
        // init TonePlayer for sound of keyPress
        TonePlayer.init('notification');

        // ref: https://en.wikipedia.org/wiki/Dual-tone_multi-frequency_signaling
        /* eslint-disable object-property-newline */
        TonePlayer.gTonesFrequencies = {
          '1': [697, 1209], '2': [697, 1336], '3': [697, 1477], 'A': [697, 1633],
          '4': [770, 1209], '5': [770, 1336], '6': [770, 1477], 'B': [770, 1633],
          '7': [852, 1209], '8': [852, 1336], '9': [852, 1477], 'C': [852, 1633],
          '*': [941, 1209], '0': [941, 1336], '#': [941, 1477], 'D': [941, 1633],
          ',': [941, 1209], '+': [941, 1336]
        };
        /* eslint-enable object-property-newline */
      }
    );

    this.specialCharsCount = this.SPECIAL_CHARS.length;

    this.onKeyPress = this.onKeyPress.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onInput = this.onInput.bind(this);
  }

  componentDidMount() {
    this.element.setAttribute('x-inputmode', 'native');

    SettingsManager.addObserver('phone.ring.keypad', this);

    SoftKeyStore.register({
      left: 'contacts',
      center: 'icon=phone',
      right: 'options'
    }, this.element);
    this.getFontStyles();
    this.getVTSupportability();
  }

  onInput() {
    let _num = this.element.value;

    this.props.updateTelNum(_num);
    this.telNum = _num;
    this.updateFontSize(_num);

    if ('' === _num) {
      this.exitDialer();
    }
  }

  onKeyPress(evt) {
    evt.preventDefault();
  }

  onKeyUp(evt) {
    let key = Qwerty.translate(evt.key);
    if ('Backspace' === key) {
      this.clearLongpressDeleteTimer();
    }
    if ('0' === key) {
      window.clearTimeout(this.longpressSpecialChar);
      this.longpressSpecialChar = null;
    }
  }

  onKeyDown(evt) {
    let key = evt.nonTranslated ? evt.key : Qwerty.translate(evt.key);
    if (this.longpressDeleteTimer || (
      Service.query('Dialer.isCalling') && ('Call' !== key || 'Enter' !== key)
    )) {
      return;
    }
    switch (key) {
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '0':
      case '#':
      case '+':
      case '*':
        if (evt.stopPropagation) {
          evt.stopPropagation();
        }
        // XXX: we are using utils.isLandscape to check if device is QWERTY
        // as workaround.
        // see bug: https://bugzilla.kaiostech.com/show_bug.cgi?id=21532
        if ('0' === key && undefined !== evt.target && utils.isLandscape) {
          window.clearTimeout(this.longpressSpecialChar);
          this.longpressSpecialChar = setTimeout(() => {
            let newChar = this.SPECIAL_CHARS[2];
            let index = this.element.selectionStart;
            let strings = this.element.value;
            this.replaceLeftChar(newChar, index, strings);
            this.playKeyTone(newChar);
          }, 1000);
        }

        /**
         * on non-QWERTY device, we can keypress `*` multi times quickly to loop special chars,
         * here we check the previous char and time interval,
         * and then it will remove previous char and set new special char for inserting later
         */
        if (
          !utils.isLandscape &&
          '*' === key &&
          -1 !== this.SPECIAL_CHARS.indexOf(this.lastKeyinChar) &&
          this.getNowTime() - this.lastInputTime < 1000
        ) {
          let { selectionStart, value } = this.element;
          let keyChar = value[selectionStart - 1];
          let lastCharIndex = this.SPECIAL_CHARS.indexOf(keyChar);
          this.element.value = value.slice(0, selectionStart - 1) + value.slice(selectionStart);
          this.element.setSelectionRange(selectionStart - 1, selectionStart - 1);
          key = this.SPECIAL_CHARS[(lastCharIndex + 1) % this.specialCharsCount];
        }

        if (evt.preventDefault) {
          evt.preventDefault();
        }
        this.insertKeyAtCaret(key);
        this.playKeyTone(key);

        this.lastKeyinChar = key;
        this.lastInputTime = this.getNowTime();
        this.onInput();
        break;

      case 'Backspace':
        evt.stopPropagation();
        this.longpressDeleteTimer = setTimeout(this.longpressDelete.bind(this), 1000);
        break;

      case 'EndCall':
        evt.stopPropagation();
        this.deleteAllText();
        break;

      case 'SoftLeft':
        evt.stopPropagation();
        LaunchStore.launch('manifestURL', 'app://contact.gaiamobile.org/manifest.webapp');
        break;

      case 'SoftRight':
        evt.stopPropagation();
        this.handleTelNumber();
        break;

      case 'Enter':
      case 'Call':
        evt.preventDefault();
        evt.stopPropagation();
        this.props.dial({ number: this.telNum });
        break;

      case 'ArrowDown':
      case 'ArrowUp':
        evt.preventDefault();
        break;

      case 'ArrowLeft':
      case 'ArrowRight':
        this.lastKeyinChar = null;
        break;

      default:
        evt.stopPropagation && evt.stopPropagation();
        evt.preventDefault && evt.preventDefault();
        break;
    }
  }

  '_observe_phone.ring.keypad'(value) {
    this._keypadSoundIsEnabled = value;
  }

  insertKeyAtCaret(key) {
    let caret = this.element.selectionEnd;
    let value = this.element.value;
    this.element.value = value.substr(0, caret) + key + value.substr(caret);
    // position caret after inserted key
    this.element.selectionEnd = caret + 1;
  }

  sendFirstChar(char) {
    this.element.value = '';
    this.onKeyDown({ key: char, nonTranslated: true });
    this.getFontStyles();
  }

  getNowTime() {
    return +new Date();
  }

  replaceLeftChar(char, index, str) {
    let leftIndex = index - 1;
    this.element.value = str.substr(0, leftIndex) + char + str.substr(leftIndex + char.length);
    this.element.setSelectionRange(index, index);
  }

  clearLongpressDeleteTimer() {
    window.clearTimeout(this.longpressDeleteTimer);
    this.longpressDeleteTimer = null;
  }

  longpressDelete() {
    this.clearLongpressDeleteTimer();
    this.deleteAllText();
  }

  deleteAllText() {
    this.element.value = '';
    this.onInput();
  }

  playKeyTone(char) {
    if (!this._keypadSoundIsEnabled) {
      return;
    }
    TonePlayer.start(TonePlayer.gTonesFrequencies[char], true);
  }

  handleTelNumber() {
    let options = [
      {
        id: 'add-to-existing-contact',
        callback: () => {
          utils.sendNumberToContact({ name: 'update', telNum: this.telNum });
        }
      },
      {
        id: 'create-new-contact',
        callback: () => {
          utils.sendNumberToContact({ name: 'new', telNum: this.telNum });
        }
      }
    ];
    // Display video call option when api exists.
    if (this.isVTSupported) {
      options.unshift({
        id: 'video-call',
        callback: () => {
          this.props.dial({ number: this.telNum, isVideo: true });
        }
      });
    }

    Service.request('showOptionMenu', {
      options: options,
      onCancel: () => this.element.focus()
    });
  }

  getFontStyles() {
    this.fontStyles = (() => {
      let styles = window.getComputedStyle(this.element);
      if (!styles) {
        return '';
      }
      return ['font-style', 'font-weight', 'font-size', 'font-family'].map((i) => styles[i]).join(' ');
    })();
  }

  updateFontSize(text) {
    if (!this.offsetWidth) {
      this.offsetWidth = this.element.offsetWidth;
    }

    let currentFontSize = this.element.style.fontSize;
    let fittedFontSize = fontFit({
      text: text,
      font: this.fontStyles,
      space: this.offsetWidth,
      min: 22,
      max: 30
    }).fontSize + 'px';

    if (currentFontSize !== fittedFontSize) {
      this.element.style.fontSize = fittedFontSize;
    }
  }

  getVTSupportability() {
    /*navigator.hasFeature && navigator.hasFeature('device.capability.vilte').then((hasVT) => {  // B2G-API
      this.isVTSupported = hasVT;
    });*/
  }

  exitDialer() {
    this.clearLongpressDeleteTimer();
    this.props.exitDialer();
  }

  render() {
    return (
      <input
        tabIndex="-1"
        className="dialer-input"
        onKeyPress={this.onKeyPress}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onInput={this.onInput}
        ref={(node) => { this.element = node; }}
      />
    );
  }
}
