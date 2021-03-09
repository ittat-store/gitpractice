import React from 'react';
import ReactDOM from 'react-dom';
import BaseComponent from './base_component';
import Hammer from 'hammerjs';
//import ReactSoftKey from 'react-soft-key';
import Service from 'service';
//import ReactSimChooser from 'react-sim-chooser';
import MainView from './main_view';
import AppList from './app_list';
//import SpeedDial from './speed_dial';
import InstantSettings from './instant_settings/instant_settings';

//import Notifications from './instant_settings/notifications_ui';
import AppNews from './app_news';
//import Dialer from './dialer';
//import DialogRenderer from './dialog_renderer';
//import OptionMenuRenderer from './option_menu_renderer';
import GridHelper from './grid_helper';
import AppTray from './app_tray';
//import './speed_dial_helper';
import '../style/scss/definitions.scss';
import '../style/scss/app.scss';
import AppsFolder from './apps_folder';


window.performance.mark('navigationLoaded');
window.addEventListener('load', () => {
  window.performance.mark('fullyLoaded');

  // performance hack to load icons of hidden panels, i.e. AppList & SpeedDial
  document.body.classList.add('loaded');
  setTimeout(() => {
    document.body.classList.remove('loaded');
    console.log("[Launcher] App timeout expired");
  }, 3000);
});

class App extends BaseComponent {
  name = 'App';
  appStates = {
    'mainView':'HomeScreen',
    'appList':'HomeScreen',
    'appTray':'AppList',
    'appNews':'AppNews',
    'instantSettings':'InstantSettings',
    'notifications':'Notifications',
    'appFolder': 'AppFolder'
  };

  currentState = 'HomeScreen';
  previousState = '';

  constructor(props) {
    super(props);

    this.panels = {};
    this.state = {
      grid: GridHelper.grid
    };
    console.log('[Launcher] App constructor');
    window.performance.mark('navigationInteractive');
    this.handleSwipe = this.handleSwipe.bind(this);
    this.handleTap = this.handleTap.bind(this);
    this.touchStartObj = null;
    this.isTouchMove = false;
    this.currentPosition = 0;
  }

  componentWillMount() {
    window.performance.mark('contentInteractive');
  }

  componentDidMount() {
    this.element = ReactDOM.findDOMNode(this);
    window.performance.mark('visuallyLoaded');

//    this.element.holder.addClass('animate').css('tranform','translate3d(-' + this.index*this.slideWidth +'px,0,0');

    // init panel
    this.focusWhenReady();

    this._handle_largetextenabledchanged();
    window.addEventListener('largetextenabledchanged', this);

    Service.register('openSheet', this);
    Service.register('closeSheet', this);
    Service.registerState('panelAnimationRunning', this);

    this.element.style.setProperty('--grid-row', this.state.grid.row);
    this.element.style.setProperty('--grid-col', this.state.grid.col);
  
    this.panels.appList.on('appTray', () => {
      console.log("[Launcher] app  appTray app state ");
      let page = this.panels.appList.getCurrentPage();
      if (page > 0) {
        this.manageAppState('appTray', true);
      } else if (page === 0) {
        this.manageAppState('appTray', false);
      }
      console.log('[Launcher] app  state ' + this.appStates);
    });

    this.panels.appList.on('openAppFolder', (appObject) => {
      console.log("[Launcher] app  openAppFolder app name is "+appObject.name);
      this.appsFolder.show();
      this.manageAppState('appFolder', true);
    });

    this.appsFolder.on('appFolderClose', () => {
      this.appsFolder.hide();
      this.panels.appList.closeAppFolder();
      this.manageAppState('appFolder', false);
    })
    /*this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));

    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this));

    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));

    this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this));*/

    this.registerSwipeEvent();
  }

  registerSwipeEvent() {
    this.gesture = new Hammer(this.element);
    //this.gesture.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    //this.gesture.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    this.gesture.get('tap').set({ enable: true });
    //this.gesture.on('swipe', this.handleSwipe);
    this.gesture.on('tap', this.handleTap);
    //this.gesture.on('doubletap', this.handleTap);
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));

    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this));

    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));

    this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this));
  }

  unRegisterSwipeEvent() {
    //this.gesture.off('swipe', this.handleSwipe);
    this.gesture.off('tap', this.handleTap);
    this.element.removeEventListener('touchstart', this.handleTouchStart.unbind(this));

    this.element.removeEventListener('touchmove', this.handleTouchMove.unbind(this));

    this.element.removeEventListener('touchend', this.handleTouchEnd.unbind(this));

    this.element.removeEventListener('touchcancel', this.handleTouchCancel.unbind(this));
  }

  handleTouchStart(e) {
    console.log('[Launcher] app  touchstart');
    this.touchStartObj = e.changedTouches[0];
    this.currentPosition = e.changedTouches[0];
    console.log('[Launcher] app  touchstart X position ' + this.touchStartObj.clientX + '  Y position : ' + this.touchStartObj.clientY);

  }

  handleTouchMove(e) 
  {
    console.log('[Launcher] app  touchmove');
    let moveX = e.changedTouches[0].clientX - this.touchStartObj.clientX;
    let moveY = e.changedTouches[0].clientY - this.touchStartObj.clientY;
    console.log('[Launcher] app  touchmove moveX:: '+moveX +'     moveY:: ' + moveY);
    if (this.currentState === this.appStates['instantSettings'] || 
      this.currentState === this.appStates['notifications'] ||
      this.currentState === this.appStates['appNews']) { return; }
    if (Math.abs(moveX) > Math.abs(moveY)) 
    {
      console.log('[Launcher] app  touchmove Swipe Horizontal');
      if(Math.abs(moveX) < 10) { return; }
      if (moveX > 0) 
      {
        //this.handleRightSwipe(e);
        this.panels.appList.scrollAppContainer(Math.abs(moveX), false);
      } 
      else 
      {
        //this.handleLeftSwipe(e);
        this.panels.appList.scrollAppContainer(Math.abs(moveX), true);
      }
    } 
    /*else 
    {
      if(Math.abs(moveY) < 10) { return; }
      if (moveY > 0) 
      {
        //this.handleDownSwipe(e);
      } 
      else
      {
        //this.handleUpSwipe(e);
      }
      console.log('[Launcher] app  touchmove Swipe Vertical');
    }*/
    this.isTouchMove = true;
    this.currentPosition = e.changedTouches[0];
  }

  handleTouchEnd(e) {
    console.log('[Launcher] app  handleTouchEnd ');
    //if (this.isTouchMove) {
      this.isTouchMove = false;
      console.log('[Launcher] app  handleTouchEnd');
      let moveX = e.changedTouches[0].clientX - this.touchStartObj.clientX;
      let moveY = e.changedTouches[0].clientY - this.touchStartObj.clientY;
      console.log('[Launcher] app  handleTouchEnd moveX:: ' + moveX + '     moveY:: ' + moveY);
      if (Math.abs(moveX) < 10 && Math.abs(moveY) < 10) { return; }
      if (Math.abs(moveX) > Math.abs(moveY)) {
        if (Math.abs(moveX) > (screen.width / 2)) {
          if (moveX > 0) {
            this.handleRightSwipe(e);
          } else {
            this.handleLeftSwipe(e);
          }
        } else {
          if (this.currentState === this.appStates['instantSettings'] || 
          this.currentState === this.appStates['notifications'] ||
          this.currentState === this.appStates['appNews']) { return; }
          this.noPageMovement();
        }

      } else {
        if(Math.abs(moveY) < 10) { return; }
        if (moveY > 0) {
          if (this.currentState === this.appStates['instantSettings'] || 
           this.currentState === this.appStates['notifications'] ||
           this.currentState === this.appStates['appNews']) { return; }
          this.handleDownSwipe(e);
        } 
        else {
          this.handleUpSwipe(e);
        }

      }
    //}
  }

  handleTouchCancel(e) {
    console.log('[Launcher] app  touchcancel');
  }

  handleTap(e) {
    console.log("[Launcher] app handleTap tap :: " + this.currentState);
    if (this.currentState === this.appStates['instantSettings'] ||
      this.currentState === this.appStates['notifications']) {
      return;
    }
     this.panels.appList.closeAppOption();
    console.log("[Launcher] app handleTap tap :: " );
  }

  handleDownSwipe(e) {
    let touchX = this.touchStartObj.clientX;
    let touchY = this.touchStartObj.clientY;
    let screenHeight = screen.availHeight;
    let screenWidth = screen.availWidth;
    let moveY = e.changedTouches[0].clientY - this.touchStartObj.clientY;
    console.log('[Launcher] app handleDownSwipe moveY:: ' + moveY);
    console.log('[Launcher] app handleDownSwipe touchX:: ' + touchX);
    console.log('[Launcher] app handleDownSwipe touchY:: ' + touchY);

    if (touchX >= 0 && 
      100 > touchX &&
     touchY >=0 && 
     touchY < 50 && 
     moveY > (screenHeight/8)) {
      this.openNotices();
    } else if (screenWidth >= touchX && 
      (screenWidth - 100) < touchX && 
      touchY >=0 && 
      touchY < 50 && 
      moveY > (screenHeight/8)) {
      this.openSettings();
    }
  }

  handleUpSwipe(e) {

    let touchX = this.touchStartObj.clientX;
    let touchY = this.touchStartObj.clientY;
    let screenHeight = screen.availHeight;
    let screenWidth = screen.availWidth;
    let moveY = e.changedTouches[0].clientY - this.touchStartObj.clientY;
    console.log('[Launcher] app handleUpSwipe moveY:: ' + moveY);
    console.log('[Launcher] app handleUpSwipe touchX:: ' + touchX);
    console.log('[Launcher] app handleUpSwipe touchY:: ' + touchY);
    console.log('[Launcher] app handleUpSwipe touch screenHeight :: ' + screenHeight );

    if (touchX <= screenWidth && 
     (screenWidth/2) < touchX &&
     touchY <= screenHeight && 
     touchY > (screenHeight - 150) && 
     Math.abs(moveY) > (screenHeight/8)) {
      console.log('[Launcher] handleUpSwipe currentState :: ' + this.currentState);
      if (this.currentState === this.appStates['instantSettings']) {
       // self.panels.instantSettings.exit();
       //this.panels.instantSettings.closeSettings();
       // Service.request('closeSheet', 'instantSettings');
      } else if (this.currentState === this.appStates['notifications']) {
        //self.panels.notifications.exit();
        Service.request('closeSheet', 'notifications');
      } else if (this.currentState === this.appStates['appFolder']) {
        console.log("[Launcher] app AppFolder " + + this.currentState);
        this.appsFolder.hide();
        this.panels.appList.closeAppFolder();
        this.manageAppState('appFolder', false);
      }
    }
  }

  /*
      DIRECTION_NONE  1
      DIRECTION_LEFT  2
      DIRECTION_RIGHT   4
      DIRECTION_UP  8
      DIRECTION_DOWN  16
      DIRECTION_HORIZONTAL  6
      DIRECTION_VERTICAL  24
      DIRECTION_ALL   30


      type  Name of the event. Like panstart.
      deltaX  Movement of the X axis.
      deltaY  Movement of the Y axis.
      deltaTime   Total time in ms since the first input.
      distance  Distance moved.
      angle   Angle moved.
      velocityX   Velocity on the X axis, in px/ms.
      velocityY   Velocity on the Y axis, in px/ms
      velocity  Highest velocityX/Y value.
      direction   Direction moved. Matches the DIRECTION constants.
      offsetDirection   Direction moved from it’s starting point. Matches the DIRECTION constants.
      scale   Scaling that has been done when multi-touch. 1 on a single touch.
      rotation  Rotation (in deg) that has been done when multi-touch. 0 on a single touch.
      center  Center position for multi-touch, or just the single pointer.
      srcEvent  Source event object, type TouchEvent, MouseEvent or PointerEvent.
      target  Target that received the event.
      pointerType   Primary pointer type, could be touch, mouse, pen or kinect.
      eventType   Event type, matches the INPUT constants.
      isFirst   true when the first input.
      isFinal   true when the final (last) input.
      pointers  Array with all pointers, including the ended pointers (touchend, mouseup).
      changedPointers   Array with all new/moved/lost pointers.
    */

  handleSwipe(e) 
  {
    
    console.log("[Launcher] app handleSwipe hidden :: " + document.hidden);
    console.log("[Launcher] app handleSwipe isAppOptionOn :: " + this.panels.appList.isAppOptionOn());
    if (document.hidden || this.panels.appList.isAppOptionOn()) { return; }
    let screenHeight = screen.height;
    let screenWidth = screen.width;
    console.log("[Launcher] app handleSwipe swipe :: " + e.direction);
    switch(e.direction) {
      case Hammer.DIRECTION_DOWN:
        console.log("[Launcher] app handleSwipe swipe :: Down");
        console.log("[Launcher] app handleSwipe deltaY :: " + e.deltaY + "  deltaX :: " + e.deltaX);
        console.log("[Launcher] app componentDidMount target :: " + e.target.className);
        console.log("[Launcher] app componentDidMount pointers X:: " + e.changedPointers[0].screenX);
        console.log("[Launcher] app componentDidMount pointers Y:: " + e.changedPointers[0].screenY);
        this.handleDownSwipe(e);
      break;
      case Hammer.DIRECTION_UP:
        console.log("[Launcher] app handleSwipe swipe :: Up");
        this.handleUpSwipe(e);
      break;
      case Hammer.DIRECTION_RIGHT:
        console.log("[Launcher] app handleSwipe swipe :: Right");
        this.handleRightSwipe(e);
      break;
      case Hammer.DIRECTION_LEFT:
        this.handleLeftSwipe(e);
      break;
    }
  }

  /*handleDownSwipe(e) {
    let screenX = e.changedPointers[0].screenX;
    let screenY = e.changedPointers[0].screenY;
    if (10 < screenX && 100 > screenX && 100 < screenY) {
      this.openNotices();
    } else if (350 < screenX && 490 > screenX && 100 < screenY) {
      this.openSettings();
    }
  }

  handleUpSwipe(e) {
    console.log('[Launcher] handleUpSwipe currentState :: ' + this.currentState);
    if (this.currentState === this.appStates['instantSettings']) {
      //self.panels.instantSettings.exit();
      Service.request('closeSheet', 'instantSettings');
    } else if (this.currentState === this.appStates['notifications']) {
      //self.panels.notifications.exit();
      Service.request('closeSheet', 'notifications');
    } else if (this.currentState === this.appStates['appFolder']) {
      console.log("[Launcher] app AppFolder " + + this.currentState);
      this.appsFolder.hide();
      this.panels.appList.closeAppFolder();
      this.manageAppState('appFolder', false);
    }
  }*/

  noPageMovement() {
    console.log("[Launcher] app noPageMovement ");
    if (this.currentState !== this.appStates['instantSettings'] && 
      this.currentState !== this.appStates['notifications']) {
      let screenObj = this.currentState === this.appStates['appFolder'] ?
        this.appsFolder : this.panels.appList;
      let page = screenObj.getCurrentPage();
      screenObj.goPage(page); 
    }
  }

  handleRightSwipe(e) {
    if (this.currentState !== this.appStates['instantSettings'] && 
      this.currentState !== this.appStates['notifications']) {
      let screenObj = this.currentState === this.appStates['appFolder'] ?
        this.appsFolder : this.panels.appList;
      let page = screenObj.getCurrentPage();
      if(page > 0) {
        page = page - 1;
        screenObj.goPage(page, false);
      } else {
        if (this.currentState !== this.appStates['appFolder']) {
          Service.request('openSheet', 'appNews');
        }
      }
    }
  }

  handleLeftSwipe(e) {
    if (this.currentState !== this.appStates['instantSettings'] && 
      this.currentState !== this.appStates['notifications']) {
      if (this.currentState === 'AppNews') {
        //Service.request('closeSheet', 'appNews');
        this.closeRecommendation();
      } else {
        let screenObj = this.currentState === this.appStates['appFolder'] ?
        this.appsFolder : this.panels.appList;
        console.log("[Launcher] app handleSwipe swipe :: Left");
        let curPage = screenObj.getCurrentPage();
        console.log("[Launcher] app handleSwipe swipe :: Left  curPage: " + curPage);
        curPage = curPage + 1;
        screenObj.goPage(curPage, true);
      }
    }
  }


  closeRecommendation() {
    document.getElementById("recommendations_cont").animate(
    [
      { transform: 'translateX(0)' }, 
      { transform: 'translateX(-30rem)' },
      { transform: 'translateX(-90rem)' }
    ], 
    { 
    duration: 700,
    iterations: 1,
    fill:'backwards'
    });  
    setTimeout(()=>
    {
    Service.request('closeSheet','appNews');
    },700);
  }


  _handle_largetextenabledchanged() {
    //document.body.classList.toggle('large-text', navigator.largeTextEnabled);   // B2G-API
  }

  focusWhenReady() {
    if (!this.focusMainView()) {
      let handler = () => {
        this.focusMainView();
        document.removeEventListener('visibilitychange', handler);
      };
      document.addEventListener('visibilitychange', handler);
    }
  }

  focusMainView() {
    console.log('[Launcher] App focusMainView');
    //this.panels.mainView.focus();
    return !document.hidden;
  }

  openSettings() {
     this.openSheet('instantSettings');
    //Service.request('openSheet', 'instantSettings');
    //this.hide();
    console.log("You clicked left bar setting1");
  }

  openNotices() {
     //this.openSheet('notifications');
    //Service.request('openSheet', 'notifications');
    //this.hide();
    //this.panels.mainView.launchNotification();
    console.log("You clicked right bar notification1");
     Service.request('openSheet', 'appNews');
  }

  // ref -> appList
  openSheet(ref) {
    //manage States set Previous State as current State
    // and set current state as ref
    console.log('[Launcher] App openSheet ref :: '+ref);
     this.panels[ref].open();    
    // if ('dialer' !== ref && 'appList' !== ref) {
    //   this.element.classList.add('grid');
    // } if ('appList' === ref) {
    //   document.getElementById('app-list').classList.add('grid');
    // }
    this.manageAppState(ref, true);
  }

  closeSheet(ref) {
    console.log('[Launcher] App closeSheet  ref ' + ref);
    if (this.panels[ref].isClosed()) {
      return;
    }
    this.panels[ref].close();
    // if ('dialer' === ref && !this.panels.appList.isClosed()) {
    //   this.panels.mainView.show();
    //   this.panels.appList.focus();
    // } else {
    //   this.panels.mainView.show();
    //   //document.getElementById('app-list').classList.remove('grid');
    //   this.panels.mainView.focus();      
    // }
    this.manageAppState(ref, false);
  }

  manageAppState(ref, isOpen) {

    console.log("manage app state ref " + ref);

    if (isOpen) {
      console.log("You clicked left bar setting");

      this.previousState = this.currentState;
      this.currentState = this.appStates[ref];
      if (ref === 'instantSettings' ||
         ref === 'notifications') {
       
       // this.panels.appTray.hide();
        this.hideTabBar();
       // this.hideMainScreen();
      } else if (ref === 'appTray') {
        // this.panels.mainView.hide();
      } else if (ref === 'appNews') 
      {
        this.panels.appTray.hide();
        document.querySelector('.tooltipparent').classList.add('hidden');

      }
    } else {
      let current = this.currentState;
      switch(this.currentState) {
        case 'HomeScreen':
          this.currentState = 'HomeScreen';
          this.previousState = '';
        break;
        case 'AppList':
        case 'AppNews':
          this.currentState = 'HomeScreen';
          this.previousState = current;
          // this.panels.mainView.show();
          this.panels.appTray.show();
        break;
        case 'InstantSettings':
        case 'Notifications':
          this.currentState = this.previousState;
          this.previousState = current;
          this.panels.appTray.show();
          this.showMainScreen();
          this.showTabBar();
        break;
        case 'AppFolder':
          this.currentState = this.previousState;
          this.previousState = current;
        break;
      }

    }
    console.log('[Launcher] manageAppState currentState :: ' + this.currentState);
    console.log('[Launcher] manageAppState previousState :: ' + this.previousState);
  }

  hideTabBar() {
    document.querySelector('.tab_bars').classList.add('hidden');
  }

  showTabBar() {
    document.querySelector('.tab_bars').classList.remove('hidden');
  }

  hideMainScreen() {
    document.getElementById('main_applist').classList.add('hidden');
  }

  showMainScreen() {
    document.getElementById('main_applist').classList.remove('hidden');
  }

  /*render() {
    return (
      <div className="app-workspace">
        <div className="app-content">
          <MainView ref={(node) => { this.panels.mainView = node; }} />
          <AppList ref={(node) => { this.panels.appList = node; }} {...this.state.grid} />
          <SpeedDial ref={(node) => { this.panels.speedDial = node; }} 
          {...this.state.grid} 
          />
          <InstantSettings
            {...this.state.grid}
            ref={(node) => { this.panels.instantSettings = node; }}
          />
          <Dialer ref={(node) => { this.panels.dialer = node; }} />
        </div>

        <OptionMenuRenderer />
        <ReactSimChooser />
        <DialogRenderer />
        <ReactSoftKey ref={(node) => { this.panels.softKey = node; }} />
      </div>
    );
  }
<Notifications
            {...this.state.grid}
            ref={(node) => { this.panels.notifications = node; }}
          />
  */
  render() {
    console.log('[Launcher] App render ');
    return (
      <div className="app-workspace">
        <div className="app-content">
          <div className='main_view tab_bars'>
            <hr className='left_bar' onClick={this.openNotices.bind(this)}></hr>
            <hr className='right_bar' onClick={this.openSettings.bind(this)}></hr>
          </div>
          <div id="main_applist" className="main-applist">
            {/* <MainView ref={(node) => { this.panels.mainView = node; }} /> */}
            <AppList ref={(node) => { this.panels.appList = node; }} />
          </div>
         
          <AppsFolder ref={(ref) => (this.appsFolder = ref)}></AppsFolder>
          
          <InstantSettings
            {...this.state.grid}
            ref={(node) => { this.panels.instantSettings = node; }}
          />
          
          <AppNews 
            {...this.state.grid}
            ref={(node) => { this.panels.appNews = node; }} 
          />
          <AppTray ref={(node) => { this.panels.appTray = node; }} />
        </div>
      </div>
    );
  }

}

console.log('[Launcher] App Loaded');

ReactDOM.render(<App />, document.getElementById('root'));
