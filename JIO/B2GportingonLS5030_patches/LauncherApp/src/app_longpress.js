import React from 'react';
import BaseComponent from './base_component';
import EnhanceAnimation from 'enhance-animation';
import AppStore from './app_store';
import '../style/scss/app_longpress.scss';

export default class AppLongPress extends BaseComponent {
  name = 'AppLongPress';

  constructor(props) {
    super(props);

  }

  show(iconPressed) {

    console.log('[Launcher] AppLongPress show' + iconPressed);
    this.element.classList.remove('hidden');
  }

  hide() {
    console.log('[Launcher] AppLongPress hide');
    this.element.classList.add('hidden');
  }

  componentDidMount() {
    console.log('[Launcher] AppLongPress show did mount');
  }


  render() {

    return (
    <div id='longpressparent_const' className="longpressparent" ref={(node) => { this.element = node; }}>
        
        <div className='options_cont'>
        
          <div className="option_div" onClick={this.hide}>
            <img className='option_icon' src='images/camera.png' />
            <span className='option_text'>Portrait Mode</span> 
          </div>

          <div className="option_div">
            <img className='option_icon' src='images/alarm.png' />
            <span className='option_text'>Landscape Mode</span>
          </div>

          <div className="option_div">
            <img className='option_icon' src='images/volume.png' />
            <span className='option_text'>Photos</span>
          </div>

          <div className="option_div">
            <img className='option_icon' src='images/brightness.png' />
            <span className='option_text'>Video</span>
            </div>
          
        </div>
    </div>
    );
  }
}

//export default EnhanceAnimation(AppLongPress, 'immediate', 'immediate');

