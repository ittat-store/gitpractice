/* global */

import React from 'react';
import Service from 'service';
import BaseComponent from 'base-component';
import EnhanceAnimation from 'enhance-animation';
import DialerInput from 'dialer_input';
import DialerSuggestions from 'dialer_suggestions';
import * as utils from 'util/utils';
import dialHelper from 'util/dial_helper';
import ContactStore from 'contact_store';
import '../style/scss/dialer.scss';
import '../style/scss/option_menu.scss';

class Dialer extends BaseComponent {
  name = 'Dialer';

  constructor(props) {
    super(props);
    this.initState = {
      dialerState: null,
      matchedContact: null,
      telNum: '',
      suggestions: []
    };
    this.state = Object.assign({}, this.initState);

    dialHelper.on('mmiloading', this.showLoading.bind(this));
    dialHelper.on('mmiloaded', this.showAlert.bind(this));
    dialHelper.on('ussd-received', this.onUssdReceived.bind(this));
    this.children = {};

    ['onKeyDown', 'call', 'hide', 'updateTelNum', 'focusInput'].forEach((fn) => {
      this[fn] = this[fn].bind(this);
    });

    Service.register('show', this);
    Service.register('hide', this);
    Service.register('resetCallingMarker', this);
    Service.registerState('isShown', this);
    Service.registerState('isCalling', this);
  }

  componentDidMount() {
    ContactStore.on('contact-changed', () => {
      if (this.isShown) {
        this.getSuggestions(this.state.telNum);
      }
    });
    this.updateTelTypes();
  }

  onUssdReceived(evt) {
    if (dialHelper.mmiloading) {
      Service.request('hideDialog');
    }

    if (!evt.message) {
      // XXX: for debuging
      Service.request('showDialog', {
        type: 'alert',
        header: 'Error USSD case!',
        content: JSON.stringify(evt),
        translated: true,
        noClose: false
      });
      return;
    }

    //let network = navigator.mozMobileConnections[evt.serviceId || 0].voice.network;  // B2G-API
    let operator = network ? (network.shortName || network.longName) : '';
    Service.request('showDialog', {
      type: 'alert',
      header: operator,
      content: evt.message.replace(/\\r\\n|\\r|\\n/g, '\n'),
      translated: true,
      noClose: false
    });
  }

  show(firstChar) {
    if (this.isShown) {
      return;
    }

    if (this.isHidden()) {
      this.updateTelTypes();
      Service.request('openSheet', 'dialer');
      this.isShown = true;

      this.element.focus();

      if (firstChar) {
        this.focusInput();
        this.children.dialerInput.sendFirstChar(firstChar);
      }
    }
  }

  hide() {
    if (!this.isHidden()) {
      Service.request('closeSheet', 'dialer');
    }
    this.isShown = false;
    this.children.dialerInput.element.style.fontSize = '';

    // reset to initState
    this.setState(this.initState);
    this.children.dialerInput.setState({
      telNum: ''
    });
  }

  updateTelTypes() {
  /*  navigator.mozL10n.ready(() => {  // B2G-API
      this.telTypes = [
        'personal',
        'mobile',
        'home',
        'work',
        'fax-home',
        'fax-office',
        'fax-other'
      ].reduce((all, i) => {
        all[i] = utils.toL10n(i);
        return all;
      }, {});
    });*/
  }

  isHidden() {
    /**
     * We are wrapped by ReactAnimationComposer but we can't access it right now.
     * So we go through the DOM tree to see if any of the ancestors are being hidden.
     */
    var element = this.element;
    while (element !== document.body &&
           (!element.classList.contains('hidden') && 'closed' !== element.dataset.transitionState)
          ) {
      element = element.parentElement;
    }
    return element.classList.contains('hidden') || 'closed' === element.dataset.transitionState;
  }

  updateTelNum(telNum) {
    let newState = {
      telNum
    };

    // clear suggestions
    if (telNum.length < 2) {
      newState.matchedContact = this.initState.matchedContact;
      newState.suggestions = this.initState.suggestions;
    }

    this.setState(newState, () => {
      if (0 === telNum.length) {
        // will trigger closed when no number in input
        this.hide();
      } else if (dialHelper.instantDialIfNecessary(telNum)) {
        this.children.dialerInput.exitDialer();
        dialHelper.dial(telNum);
      }

      if (telNum.length >= 2) {
        this.getSuggestions(telNum);
      }
    });
  }

  focusInput() {
    this.stopRenderSteply();
    this.children.dialerInput.element.focus();
  }

  focusSuggestions() {
    if (!this.state.suggestions.length) {
      return;
    }

    this.children.dialerSuggestions.initFocus();

    if (this.allSuggestions.keyword) {
      return;
    }

    setTimeout(() => {
      this.renderSteply();
    }, 0);
  }

  renderSteply(step = 10, time = 50) {
    let nowLen = this.state.suggestions.length;
    if (this.allSuggestions.length <= nowLen) {
      this.stopRenderSteply();
      return;
    }
    let suggestions = this.allSuggestions.slice(0, nowLen + step);
    suggestions.keyword = this.state.telNum;
    this.setState({
      suggestions
    });
    this.suggestionRenderTimer = setTimeout(this.renderSteply.bind(this), time);
  }

  stopRenderSteply() {
    if (this.suggestionRenderTimer) {
      window.clearTimeout(this.suggestionRenderTimer);
      this.suggestionRenderTimer = null;
    }
  }

  call({ number = this.state.telNum, isVideo = false } = {}) {
    if (this.isCalling) {
      Service.request('showDialog', {
        ok: 'skip',
        cancel: 'cancel',
        type: 'confirm',
        content: 'otherConnectionInUseMessage',
        onOk: () => {
          Service.request('Dialer:resetCallingMarker');
        }
      });
      return;
    }
    this.isCalling = true;
    this.stopRenderSteply();

    dialHelper.dial(number, isVideo)
      .then(() => {
        this.isCalling = false;
        Service.request('Dialer:hide');
        Service.request('hideDialog');
      })
      .catch(() => {
        this.isCalling = false;
      });
  }

  getSuggestions(num) {
    if (!dialHelper.isValid(num)) {
      return;
    }

    utils.contactNumFilter({ telNum: num }).then(this.filterSuggestions.bind(this, num));
  }

  filterSuggestions(num, contacts) {
    let matchedContact;
    let suggestions = contacts.reduce((summary, _contact) => {
      return summary.concat(_contact.tel.map((_tel) => {
        let contactInfo = {
          id: _contact.id,
          name: _contact.name && _contact.name[0],
          type: this.getL10nFromTelTypes(_tel.type[0] || 'mobile'),
          number: _tel.value
        };
        // get first contact info for .dialer-header
        if (!matchedContact && (_tel.value === num)) {
          matchedContact = contactInfo;
        }
        return contactInfo;
      }));
    }, []).filter((_s) => (-1 !== _s.number.indexOf(this.state.telNum)));

    this.allSuggestions = suggestions;

    // slice for first viewport lists
    // 5: magic number for critical path
    this.renderSuggestions(suggestions.slice(0, 5), matchedContact, num);
  }

  renderSuggestions(suggestions, matchedContact, num) {
    // checking tel-num, avoiding search delay
    if (num === this.state.telNum) {
      // keep keyword property for updating suggestions component
      suggestions.keyword = num;
      this.setState({
        matchedContact,
        suggestions
      }, () => {
        this.children.dialerSuggestions.element.scrollTo(0, 0);
      });
    }
  }

  onKeyDown(evt) {
    let key = evt.key;
    evt.stopPropagation();

    switch (key) {
      case 'EndCall':
        this.hide();
        break;

      case 'ArrowDown':
        this.focusSuggestions();
        break;

      default:
        break;
    }
  }

  getMatchedContactInfo(matchedContact = this.state.matchedContact) {
    let matchedContactInfo;
    if (matchedContact) {
      matchedContactInfo = [matchedContact.name, matchedContact.type].filter(Boolean).join(', ');
    }
    return matchedContactInfo;
  }

  showAlert(title, message) {
    Service.request('Dialer:hide');
    if (!title && !message) {
      return;
    }
    Service.request('showDialog', {
      type: 'alert',
      header: title,
      content: utils.toL10n(message),
      translated: true,
      noClose: false
    });
  }

  resetCallingMarker() {
    this.isCalling = false;
  }

  showLoading() {
    Service.request('Dialer:hide')
    .then(() => {
      Service.request('showDialog', {
        type: 'alert',
        content: 'sending',
        otherClass: 'is-loading',
        noClose: false
      });
    });
  }

  getL10nFromTelTypes(type) {
    return this.telTypes[type] || type;
  }

  render() {
    return (
      <div
        className="dialerBox"
        tabIndex="-1"
        onKeyDown={this.onKeyDown}
        ref={(node) => { this.element = node; }}
      >
        <div className="dialer-header">
          <div className="dialer-state text-thi">{this.state.dialerState}</div>
          <DialerInput
            ref={(node) => { this.children.dialerInput = node; }}
            dial={this.call}
            exitDialer={this.hide}
            updateTelNum={this.updateTelNum}
          />
          <div className="dialer-info text-thi">{this.getMatchedContactInfo()}</div>
        </div>

        <DialerSuggestions
          ref={(node) => { this.children.dialerSuggestions = node; }}
          suggestions={this.state.suggestions}
          exitSuggestions={this.focusInput}
          dial={this.call}
        />
      </div>
    );
  }
}

export default EnhanceAnimation(Dialer, 'immediate', 'immediate');
