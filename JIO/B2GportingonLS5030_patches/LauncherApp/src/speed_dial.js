/* global MozActivity */

import React from 'react';
import BaseComponent from 'base-component';
import EnhanceAnimation from 'enhance-animation';
import Service from 'service';
import SoftKeyStore from 'soft-key-store';
import SpeedDialStore from './speed_dial_store';
import SpeedDialHelper from './speed_dial_helper';
import SimCardHelper from './util/sim_card_helper';
import * as utils from './util/utils';
import '../style/scss/speed_dial.scss';

function SpeedDialItem(props) {
  let _photoAttr = {
    'data-dial': props.dial,
    style: props.photo ? { backgroundImage: `url(${props.photo})` } : null
  };

  let _nameAttr = {
    'data-l10n-id': ('voicemail' === props.attrs['data-id']) ? 'voicemail' : null
  };

  return (
    <div {...props.attrs}>
      <div className="photo-box">
        <div className="photo" {..._photoAttr} />
      </div>
      <div className="name" {..._nameAttr}>
        {props.title}
      </div>
    </div>
  );
}

class SpeedDial extends BaseComponent {
  name = 'SpeedDial';

  static defaultProps = {
    col: 3,
    row: 3
  };

  static propTypes = {
    row: React.PropTypes.number,
    col: React.PropTypes.number
  };

  constructor(props) {
    super(props);
    this.initFocus = [0, 0];
    this.dialMapping = {};

    this.state = {
      focus: this.initFocus,
      dials: []
    };

    this.gridCount = this.props.col * this.props.row;

    this.onFocus = this.onFocus.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    Service.register('show', this);
    Service.register('hide', this);
    this.updateSoftKeys();

    SpeedDialStore.on('changed', () => {
      let _contacts = utils.simpleClone(SpeedDialStore.contacts);

      // remove voicemail icon when speed-dial count is larger than grid count
      // it means that we are working on landscape orientation
      if (_contacts.length > this.gridCount) {
        _contacts = _contacts
         .filter((contact) => 'voicemail' !== contact.id)
         .slice(0, this.gridCount);
      }

      this.contacts = _contacts;
      this.updateContacts(_contacts);
    });

    this.element.addEventListener('blur', this.blur.bind(this));
  }

  updateContacts(contacts) {
    let dials = contacts.map((contact, index) => {
      let title = contact.name || contact.tel;
      contact.title = title;

      contact.attrs = {
        className: 'contact focusable',
        tabIndex: -1,
        'data-l10n-id': contact.tel ? 'speed-dial-not-empty' : 'speed-dial-empty',
        'data-l10n-args': JSON.stringify({ order: contact.dial, name: title }),
        'data-tel': contact.tel || null,
        'data-id': contact.id || null,
        'role': 'menuitem',
        'aria-setsize': SpeedDialStore.SIZE,
        'aria-posinset': contact.dial,
        onClick: () => SpeedDialHelper.speedDial(contact.dial)
      };

      contact.key = `speed-dial-${contact.dial}-${contact.id || ''}`;

      if ('voicemail' === contact.id) {
        contact.attrs.className += ' voicemail';
        contact.attrs['data-l10n-id'] = 'speed-dial-not-empty';
      } else if (!contact.tel) {
        contact.attrs.className += ' empty';
      }

      // for key-mapping
      this.dialMapping[contact.dial] = index;
      return contact;
    });

    this.setState({
      dials: dials
    }, () => {
      this.gridElements = this.element.querySelectorAll('.contact');
      this.focusIfPossible();
    });
  }

  blur() {
    if (!this.element.contains(document.activeElement)) {
      this.setState({ focus: utils.isRtl() ? [0, this.props.col - 1] : this.initFocus });
    }
  }

  componentDidUpdate() {
    this.focusIfPossible();
    this.updateSoftKeys();
  }

  onKeyDown(evt) {
    let key = evt.key;
    let _activeElement = document.activeElement;
    let _activeDial = this.state.dials[utils.rowColToIndex(this.state.focus, this.props.col)];
    let handler = true;
    switch (key) {
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9': {
        let targetDialIndex = this.dialMapping[key];
        if (undefined !== targetDialIndex) {
          this.setState({
            focus: utils.indexToRowCol(targetDialIndex, this.props.col)
          }, () => {
            SpeedDialHelper.speedDial(key);
          });
        }
        break;
      }
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown': {
        let nextRowCol = utils.navGrid({
          currentRowCol: this.state.focus,
          dir: key,
          col: this.props.col,
          total: this.gridCount
        });
        this.setState({
          focus: nextRowCol
        });
        break;
      }

      case 'SoftLeft': {
        if (_activeDial.editable && _activeDial.tel) {
          this.sendSms(_activeDial.tel);
        }
        break;
      }

      case 'SoftRight': {
        if (_activeDial.editable && _activeDial.tel) {
          this.showOptionMenu(_activeDial);
        }
        break;
      }
      case 'Call':
      case 'Enter':
        _activeElement.click();
        break;
      case 'EndCall':
      case 'Backspace':
        Service.request('closeSheet', 'speedDial');
        break;
      default:
        break;
    }
    if (handler) {
      evt.stopPropagation();
      evt.preventDefault();
    }
  }

  sendSms(telNumber) {
    new MozActivity({
      name: 'new',
      data: {
        type: 'websms/sms',
        number: telNumber
      }
    });
  }

  showOptionMenu(targetDial) {
    let number = targetDial.dial;
    let name = targetDial.title;
    this.saveFocus();
    Service.request('showOptionMenu', {
      options: [
        {
          id: 'option-remove',
          callback: () => {
            SpeedDialHelper.removeSpeedDial({
              number,
              name,
              cb: this.focusLast.bind(this)
            });
          }
        },
        {
          id: 'option-replace',
          callback: () => {
            SpeedDialHelper.replaceSpeedDial({
              number,
              name,
              contactId: this._lastFocus.getAttribute('data-id')
            });
          }
        }
      ]
    });
  }

  saveFocus() {
    this._lastFocus = this._lastFocus || document.activeElement;
  }

  focusLast() {
    if (this._lastFocus) {
      this._lastFocus.focus();
      this._lastFocus = null;
    }
  }

  onFocus() {
    this.focusIfPossible();
    this.updateSoftKeys();
  }

  updateSoftKeys() {
    let _activeDial = this.state.dials[utils.rowColToIndex(this.state.focus, this.props.col)];
    let _softKeys = {
      left: '',
      center: 'select',
      right: ''
    };
    if (_activeDial && _activeDial.tel) {
      _softKeys.center = 'icon=phone';
      if (_activeDial.editable) {
        _softKeys.left = 'message';
        _softKeys.right = 'options';
      }
      this.registerCallSoftKeys(_softKeys);
    } else {
      SoftKeyStore.register(_softKeys, this.element);
    }
  }

  registerCallSoftKeys(_softKeys) {
   /* if (navigator.mozMobileConnections.length > 1 && !SimCardHelper.isAlwaysAsk()) {  // B2G-API
      _softKeys.center = `icon=call-sim${SimCardHelper.cardIndex + 1}`;
    }*/
    SoftKeyStore.register(_softKeys, this.element);
  }

  isHidden() {
    /**
     * We are wrapped by ReactAnimationComposer but we can't access it right now.
     * So we go through the DOM tree to see if any of the ancestors are being hidden.
     */
    return !this.element.offsetParent;
  }

  focusIfPossible() {
    if (this.isHidden()) {
      return;
    }
    let _index = utils.rowColToIndex(this.state.focus, this.props.col);
    let app = this.gridElements && this.gridElements[_index];
    if (!app) {
      this.element.focus();
      return;
    }
    app.focus();
  }

  render() {
    let dialsHtml = this.state.dials.map((dial) => {
      return (<SpeedDialItem key={dial.key} {...dial} />);
    });

    return (
      <bdi
        id="speed-dial"
        className="speed-dial"
        tabIndex="-1" role="heading" aria-labelledby="speed-dial-title"
        onFocus={this.onFocus}
        onKeyDown={this.onKeyDown}
        ref={(node) => { this.element = node; }}
      >
        <h1 className="readout-only" id="speed-dial-title" data-l10n-id="speed-dial" />
        {dialsHtml}
      </bdi>
    );
  }
}

export default EnhanceAnimation(SpeedDial, 'immediate', 'immediate');
