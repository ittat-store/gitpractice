import React from 'react';
import BaseComponent from 'base-component';
import Service from 'service';
import SoftKeyStore from 'soft-key-store';
import SimpleNavigationHelper from 'simple-navigation-helper';

export default class DialerSuggestions extends BaseComponent {
  name = 'DialerSuggestions';

  static defaultProps = {
    dial: null,
    exitSuggestions: null,
    suggestions: null
  };

  static propTypes = {
    dial: React.PropTypes.func,
    exitSuggestions: React.PropTypes.func,
    suggestions: React.PropTypes.arrayOf(React.PropTypes.object)
  };

  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    //this.suggestionNavigator = new SimpleNavigationHelper('.dialer-focusable', this.element);  // B2G-API
    this.getVTSupportability();

    SoftKeyStore.register({
      left: '',
      center: 'icon=phone',
      right: this.isVTSupported ? 'options' : ''
    }, this.element);
  }

  getVTSupportability() {
    /*navigator.hasFeature && navigator.hasFeature('device.capability.vilte').then((hasVT) => {  // B2G-API
      this.isVTSupported = hasVT;

      SoftKeyStore.register({
        left: '',
        center: 'icon=phone',
        right: hasVT ? 'options' : ''
      }, this.element);
    });*/
  }

  handleOption() {
    if (!this.isVTSupported) {
      return;
    }
    let options = [
      {
        id: 'video-call',
        callback: () => {
          this.props.dial({ number: this.getFocusedSuggestion().number, isVideo: true });
        }
      }
    ];

    Service.request('showOptionMenu', {
      options: options,
      onCancel: () => this.element.focus()
    });
  }

  onKeyDown(evt) {
    if (Service.query('Dialer.isCalling')) {
      return;
    }
    switch (evt.key) {
      case 'SoftRight':
        evt.stopPropagation();
        this.handleOption();
        break;

      case 'Backspace':
        evt.stopPropagation();
        evt.preventDefault();
        this.props.exitSuggestions();
        break;

      case 'Enter':
      case 'Call':
        evt.stopPropagation();
        this.props.dial({ number: this.getFocusedSuggestion().number });
        break;
      default:
        break;
    }
  }

  getFocusedSuggestion() {
    //let _nav = this.suggestionNavigator;  // B2G-API
    let _index = _nav._candidates.indexOf(_nav._currentFocus);
    return this.props.suggestions[_index];
  }

  initFocus() {
    /**
      * XXX: When the user presses ArrowDown in dialerInput,
      *  we will switch the focus to suggestions list.
      * However, it will get extra keydown event of ArrowDown
      *  even if we do stopImmediatePropagation in Dialer.
      * It might be due to React's event mechanism,
      *  so we choose to setTimeout here to get rid out of it.
      */
    setTimeout(() => {
      let firstItem = this.element.querySelector('.dialer-focusable');
      // reset to focus the first item
      firstItem.focus();
      //this.suggestionNavigator.setFocus(firstItem); // B2G-API
    }, 0);
  }

  formatMatchedNum(baseStr, keyword = this.props.suggestions.keyword) {
    let _start = baseStr.indexOf(keyword);
    if (-1 === _start) {
      return;
    }

    let prefix = baseStr.slice(0, _start);
    let suffix = baseStr.slice(_start + keyword.length);

    return (
      <span dangerouslySetInnerHTML={{ __html: `${prefix}<mark>${keyword}</mark>${suffix}` }} />
    );
  }

  suggestionsHtml() {
    let suggestionsHtml = this.props.suggestions.map((i, v) => {
      return (
        <li key={`suggestions-${v}`} className="dialer-focusable" tabIndex="-1">
          <div className="dialerSuggestion">
            <div className="dialerSuggestion__header text-pri">
              {i.name}
            </div>
            <div className="dialerSuggestion__detail text-sec">
              {i.type} {this.formatMatchedNum(i.number)}
            </div>
          </div>
        </li>
      );
    });

    return suggestionsHtml;
  }

  render() {
    return (
      <ul
        className="dialerSuggestions"
        onKeyDown={this.onKeyDown}
        ref={(node) => { this.element = node; }}
      >
        {this.suggestionsHtml()}
      </ul>
    );
  }
}
