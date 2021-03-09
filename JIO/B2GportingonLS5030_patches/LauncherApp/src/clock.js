import React from 'react';
import BaseComponent from './base_component';
import Service from 'service';
import SettingsManager from 'settings-manager';
import '../style/scss/clock.scss';
import '../style/scss/common.scss';

export default class Clock extends BaseComponent { 
  name = 'Clock';

  initState = {
    datetime: '',
    timeForReadout: '',
    date: '',
    h1: '0',
    h2: '0',
    m1: '0',
    m2: '0',
    ampm: '',
    visible: ('true' === localStorage.getItem('home.clock.visible'))
  };

  constructor(props) {
    super(props);

    this.state = { ...this.initState };
    console.log("[Launcher] Clock constructor");
    /*navigator.mozL10n.ready(() => {  // B2G-API
      // get cached navigator.mozHour12 value for performance
      if (null === navigator.mozHour12) {
        navigator.mozHour12 = ('true' === localStorage.getItem('locale.hour12'));
      }
      this.refresh();
    });*/

    this.digiKey = 0;
    this.digiIcons = (weight = 'bold', total = 10) => {
      this.digiKey += 1;
      return [...Array(total)].map((v, i) => {
        return (
          <i
            key={`key_${i}_${weight}_${this.digiKey}`}
            data-icon={`numeric_${i}_${weight}`}
            aria-hidden="true"
          />);
      });
    };

    this.iconsHtml = {
      'bold': this.digiIcons(),
      'light': this.digiIcons('light')
    };
  }

  // Not focusable
  focus() {
    this.element.focus();
  }

  componentWillMount() {
    console.log("[Launcher] Clock componentWillMount");
    SettingsManager.addObserver('home.clock.visible', this);
    SettingsManager.addObserver('locale.hour12', this);
  }

  componentDidMount() {
    console.log("[Launcher] Clock componentDidMount");
    Service.register('start', this);
    Service.register('stop', this);
  }

  refresh() {
    if (!this.state.visible) {
      return;
    }
    /*navigator.mozL10n.ready(() => {   // B2G-API
      var now = new Date();

      // time format ref: http://pubs.opengroup.org/onlinepubs/007908799/xsh/strftime.html
      let hourFormat = navigator.mozHour12 ? '%I' : '%H';
      let strForTime = new navigator.mozL10n.DateTimeFormat();
      let allTimeStr = strForTime.localeFormat(now, `%a, %e %b | %p | ${hourFormat} | %M`);

      let [nowDateStr, nowPM, nowHour, nowMinute] = allTimeStr.split(' | ');

      nowHour = `00${nowHour}`.slice(-2).split('');
      nowMinute = nowMinute.split('');

      this.setState({
        datetime: strForTime.localeFormat(now, '%Y-%m-%dT%T'),
        timeForReadout: strForTime.localeFormat(now,
          `homescreen %I:%M ${navigator.mozHour12 ? '%p' : ''}, %A %B %e`),
        date: nowDateStr,
        h1: nowHour[0],
        h2: nowHour[1],
        m1: nowMinute[0],
        m2: nowMinute[1],
        ampm: nowPM
      });
    });*/
  }


  _handle_moztimechange() {
    console.log("[Launcher] Clock _handle_moztimechange");
    this.stop();
    this.start();
  }

  _handle_timeformatchange() {
    this.refresh();
  }

  _handle_visibilitychange() {
    if ('visible' === document.visibilityState) {
      this.start();
    } else {
      this.stop();
    }
  }

  start() {
     console.log("[Launcher] Clock start()");
    let now = new Date();
    this.refresh();

    this.timer = setTimeout(() => {
      this.start();
    }, (60 - now.getSeconds()) * 1000);
  }

  
  '_observe_locale.hour12'(value) {
    localStorage.setItem('locale.hour12', value);
  }

  '_observe_home.clock.visible'(value) {
    localStorage.setItem('home.clock.visible', value);
    this.setState({
      visible: value
    });

    this.stop();
    if (value) {
      // restart if switching on
      this.start();
      window.addEventListener('moztimechange', this);
      window.addEventListener('timeformatchange', this);
      window.addEventListener('visibilitychange', this);
    } else {
      window.removeEventListener('moztimechange', this);
      window.removeEventListener('timeformatchange', this);
      window.removeEventListener('visibilitychange', this);
    }
  }

  stop() {
    console.log("[Launcher] Clock stop()");
    clearInterval(this.timer);
    this.timer = null;
  }

  render() {
    this.state.visible = true;
    console.log("[Launcher] Clock render  ");
    if (!this.state.visible) {
      return null;
    }
    return (
      <time
        {...{
          className: 'ClockComponent',
          dateTime: this.state.datetime,
          role: 'menuitem',
          'aria-label': this.state.timeForReadout
        }}
      >
        <div className="clock-upper">
          <bdi className="clockDigi-container">
            <span className="hour clockDigi-box">
              <span className="clockDigi clockDigi--time" data-now={this.state.h1}>
                {this.iconsHtml.bold}
              </span>

              <span className="clockDigi clockDigi--time" data-now={this.state.h2}>
                {this.iconsHtml.bold}
              </span>
            </span>

            <div className="clock-colon" />

            <span className="minute clockDigi-box">
              <span className="clockDigi clockDigi--time" data-now={this.state.m1}>
                {this.iconsHtml.bold}
              </span>

              <span className="clockDigi clockDigi--time" data-now={this.state.m2}>
                {this.iconsHtml.bold}
              </span>
            </span>
          </bdi>
          <div
            className="clock-ampm primary"
            //data-hour-24={!navigator.mozHour12}  // B2G-API
          >
            {this.state.ampm}
          </div>
        </div>

        <hr className="clock-divider" />

        <div className="date primary">
          {this.state.date}
        </div>
      </time>
    );
  }
}


console.log('[Launcher] clock Loaded');
