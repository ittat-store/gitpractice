import React from 'react';
import BaseComponent from './base_component';
import AppStore from './app_store';
import '../style/scss/app_tray.scss';




export default class AppTray extends BaseComponent {
  name = 'AppTray';

  constructor(props) {
    super(props);
    this.state = {
      apps: []
    };

  }

  start() {
  }

  stop() {
  }

  show() {
    console.log('[Launcher] AppTray show');
    document.querySelector('.col3parent').classList.remove('hidden');
    //this.element.classList.remove('hidden');
  }

  hide() {
    console.log('[Launcher] AppTray hide');
    document.querySelector('.col3parent').classList.add('hidden');
    //this.element.classList.add('hidden');
  }

  componentDidMount() {
    this.store = AppStore;
    AppStore.on('ready', () => {
      this.setState({
        apps: AppStore.hotTrayApps
      });



      //console.log('[Launcher] AppTray componentDidMount apps :: ' + this.state.apps.length);
    });
  }

  render() {

  
    let tray = [];
    console.log('[Launcher] AppTray render :: ' + this.state.apps.length);
    if (this.state.apps.length != 0) {
      this.state.apps.forEach(app => {
        console.log('[Launcher] APPS NAME :: ' + app.name);
        // console.log('[Launcher] APPS Icon url :: ' + app.icon_url);
       

        tray.push(
          <div className="col3" onClick={app.launch} >
            <img className="img_val" src={app.icon_url} roundedCircle />
          </div>
        );
      });
    }

    return (
      <div className="col3parent" roundedCircle>
         <div className="col3parent_trans" roundedCircle>
        <row>
          {tray}
        </row>
        </div>
       </div>
    );

  }

}




