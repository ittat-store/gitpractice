/* global MozActivity */

import React from 'react';
import BaseComponent from './base_component';
import EnhanceAnimation from 'enhance-animation';
import Hammer from 'hammerjs';
import AppStore from './app_store';
import SoftKeyStore from 'soft-key-store';
import Service from 'service';
import ToolTips from './tooltips';
import * as utils from 'util/utils';
import '../style/scss/app_list.scss';
import MainView from './main_view';

export default class AppList extends BaseComponent {
  name = 'AppList';

  static defaultProps = {
    col: 4,
    row: 5
  };

  static propTypes = {
    col: React.PropTypes.number,
    row: React.PropTypes.number
  };

  constructor(props) {
    console.log('[Launcher] AppList constructor');
    super(props);
    this.state = {
      apps: [],
      focus: [0, 0]
    };
    this.currentPage = 0;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onFocus = this.onFocus.bind(this);
    if (window.NodeList && !NodeList.prototype.forEach) {
      NodeList.prototype.forEach = Array.prototype.forEach;
    }
  }

  getPage(row) {
    let page;
    console.log('[Launcher] AppList goPage getPage row : ' + row);
    if (row < 5) {
      page = Math.floor(row / 3);
    } else {
      page = Math.floor(row / (this.props.row));
    }
    console.log('[Launcher] AppList goPage getPage page : ' + page);
    return page;
  }

  componentDidUpdate(prevProps, prevState) {
    let rowFrom = prevState.focus[0];
    let rowTo = this.state.focus[0];
    let pageFrom = this.getPage(rowFrom);
    let pageTo = this.getPage(rowTo);
    console.log('[Launcher] AppList componentDidUpdate');
    if (pageFrom !== pageTo) {
      this.goPage(pageTo);
    } else {
      //this.focusIfPossible();
    }
    this.updateSoftKeys();
    this.addNotifications();
    this.setAppListContainerWidth();
  }

  goPage(p, isLeftSwipe=true) {

    let allPages = this.element.querySelectorAll('.page');
    let page = allPages && allPages[p];
    console.log('[Launcher] AppList goPage p : ' + p);
    if (!page) {
      return;
    }

    //this.focusIfPossible();
    

    let appList_con = document.getElementById('app-list');
    if(isLeftSwipe) {
      appList_con.classList.remove('animateLeftToRight');
      appList_con.classList.add('animateRightToLeft');
    } else {
      appList_con.classList.remove('animateRightToLeft');
      appList_con.classList.add('animateLeftToRight');
    }

    if (p > 0) {
      console.log('[Launcher] AppList  emit page change');
      //this.mainView.hide();
     // appList_con.style.top = 0;
    } else if (p == 0) {
     // appList_con.style.top = "25rem";
      //this.mainView.show();
    }
    this.currentPage = p;
    this.emit('appTray');
    let left = page.offsetLeft - this._container.offsetLeft;
    console.log('[Launcher] AppList  emit page  left :: ' + left);
    let top = this._container.offsetTop;
    //this._container.scrollTo({ left: left, top: top,  behaviour: 'smooth'});

    this.scrollOnPageChange(left, isLeftSwipe);
    
    
    page.focus();
    this.setPageIndicator(p);
  }

  setPageIndicator(pageNumber) {
    let allPageIndicator = this.element.querySelectorAll('.page-indicator');
    allPageIndicator.forEach((pageIndicator, index)=>{
      if (index == pageNumber) {
        pageIndicator.classList.add('active');
      } else {
        pageIndicator.classList.remove('active');
      }
    });
  }

  getCurrentPage() {
    return this.currentPage;
  }

  componentDidMount() {
    this.store = AppStore;
    console.log('[Launcher] AppList componentDidMount');
    AppStore.on('ready', () => {
      this.setState({
        apps: this.appHandler(AppStore.apps)
      }, () => {
        AppStore.update();
        AppStore.sort();
        
        //let app = this.element.querySelector(`[data-row-index="${this.state.focus[0]}"][data-col-index="${this.state.focus[1]}"]`);
        //app.focus();
      });
    });
    AppStore.on('change', (evt) => {
      let isFocused = this.element.contains(document.activeElement);
      let apps = this.appHandler(AppStore.apps);
      let lastIndex = apps.length - 1;
      let currentFocusIndex = utils.rowColToIndex(this.state.focus, this.props.col);
      this.setState({
        apps
      }, () => {
        // Get back the focus after the AppList is refreshed.
        if (AppStore.isRefreshing) {
          AppStore.isRefreshing = false;
          this.focus();
        }
        if (this.element.offsetParent && isFocused &&
            evt && evt.type && 'remove' === evt.type) {
          // force re-focus app-list to avoid lose focus to body
          this.focus();
          if (currentFocusIndex > lastIndex) {
            this.state.focus = utils.indexToRowCol(lastIndex, this.props.col);
          }
        }
        //this.focusIfPossible();
      });
    });
    this.updateSoftKeys();

    Service.register('show', this);
    Service.register('hide', this);
    window.addEventListener('visibilitychange', this);
    this.element.addEventListener('blur', this.blur.bind(this));
    //SpeedDialHelper.register(this.element);

    this.element.addEventListener('animationstart', () => {
      this.isAnimationEnd = false;
    });
    this.element.addEventListener('animationend', () => {
      this.isAnimationEnd = true;
    });

    var allPopup = document.querySelectorAll('.popup');
    if (allPopup) {
      allPopup.forEach((popup) => {
        popup.classList.add('hidden');
      });
      console.log('[Launcher] AppList app popup ' + allPopup.length);
    }
    //this.addAppsEvent();

    
    if (this.toolTips) {
      this.toolTips.on('tooltipclicks', ()=>{ 
        console.log('[Launcher] AppList tooltipclicks');
        this.closeAppOption();
      });
    }
    this.registerSwipeEvent();
    
  }

  registerSwipeEvent() {
    this.gesture = new Hammer(this.element);
    this.gesture.get('press').set({ time: 1000 });
    this.gesture.on('press', this.onAppPress.bind(this));
    this.gesture.on('pressup', this.onAppPressUp.bind(this));

  }

  unRegisterSwipeEvent() {
    this.gesture.off('press', this.onAppPress.unbind(this));
    this.gesture.off('pressup', this.onAppPressUp.unbind(this));
  }


  closeAppFolder() {
    this.isFolderOpen = false;
    this.isLongPress = false;
  }


  onAppPress(e) {
    /*this.isLongPress = true;
    this.isFolderOpen = true;*/
  }

  closeAppOption() {
    if (this.isLongPress) {
      this.toolTips.hide();
      var self = this;
      setTimeout(()=>{ self.isLongPress = false; }, 1500);
    }
  }

  onAppPressUp(e) {
    console.log('[Launcher] AppList onAppPressUp isFolderOpen ' + this.isFolderOpen);
    if (this.isFolderOpen) { return; }
    console.log('[Launcher] AppList onAppPressUp pressUP ' + e.target);
    let parentEle = e.target.parentElement;
    this.isLongPress = true;
    this.toolTips.show(parentEle, 3);
   
  }

  openFolder(e) {
    this.isLongPress = true;
    this.isFolderOpen = true;
    let appIndex = e.target.parentElement.getAttribute('data-index') || 
      e.target.getAttribute('data-index');
      console.log('[Launcher] AppList openFolder appIndex ' + appIndex);
    let targetApp = this.state.apps[appIndex];
    this.emit('openAppFolder', targetApp);
    console.log('[Launcher] openFolder is ' + appIndex+'...[Launcher] targetApp is ' + this.targetApp);
    
  }

  onAppClick(e) {
    console.log('[Launcher] onAppClick is longpress ' + this.isLongPress);
    if (this.isLongPress) {
      e.stopPropagation();
    }
  }

  isAppOptionOn() {
    return this.isLongPress && !this.isFolderOpen;
  }

  addNotifications() {
    var allApps = this.element.querySelectorAll('.app');
    console.log('[Launcher] addNotifications allApps :: ' + allApps.length);
    
    
    allApps.forEach((app, index)=>{
      console.log('[Launcher] addNotifications app :: ' + app.dataset.manifestUrl);
      let randNum = this.getRandomNum(5);
      if (index % 2 === 0 && randNum > 0 && index !== 0 &&  index  !== 2) {
        let notiElement = app.querySelector('.badge');
        notiElement.classList.remove('hidden');
        notiElement.innerHTML = randNum;
      }
    });
  }

  getRandomNum(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  _handle_visibilitychange() {
    console.log('[Launcher] AppList _handle_visibilitychange');
    const isContainsActiveElement = this.element.contains(document.activeElement);
    const isVisible = !document.hidden;
    if (isVisible) {
      // Because app items may be re-rendered due to AppStore updates.
      // (e.g. items will be reordered while there's an item was marked
      // as favorite)
      // Thus, we need to manually refocus to AppList otherwise we will
      // lost focus like bug 2537.
      const needToRefocusToAppList =
        !isContainsActiveElement && this.isHiddenFromApplist;

      if (needToRefocusToAppList) {
        if (Service.query('Dialer.isShown')) {
          // The only exception is when Dialer overlay opened.
          // We don't need to refocus while Dialer overlay
          // is running at foreground.
          // Otherwise we'll lost focus from Dialer overlay.
          return;
        }
        this.element.focus();
        //this.focusIfPossible();
      }
    } else {
      // Set a flag if the app is left from AppList screen.
      this.isHiddenFromApplist = isContainsActiveElement;
      // Reorder the app items when app is in the background.
      // This is mainly for refreshing favorited items.
      AppStore.sort();
    }
  }

  updateSoftKeys(_keys = { center: 'icon=ok', right: 'favorite' }) {
    this.focusIndex = utils.rowColToIndex(this.state.focus, this.props.col);
    this.targetApp = this.state.apps[this.focusIndex];
    if (!this.targetApp) {
      return;
    }
    if ('true' === document.activeElement.dataset.favorite) {
      _keys.right = 'unfavorite';
    }
    if (this.targetApp.removable) {
      _keys.left = 'uninstall';
    }
    SoftKeyStore.register(_keys, this.element);
  }

  show() {
    console.log('[Launcher] AppList show');
    this.element.classList.remove('hidden');
    this.focus();
  }

  hide() {
    console.log('[Launcher] AppList hide');
    this.element.classList.add('hidden');
  }

  focus() {
    console.log('[Launcher] AppList focus');
    this.element.focus();
  }

  onDivClick(e) {
    console.log('[Launcher] AppList onDivClick ');
    this.element.focus();
  }

  onFocus() {
    console.log('[Launcher] AppList onFocus');
    if (this.element === document.activeElement) {
      //this.focusIfPossible();
      this.updateSoftKeys();
      return;
    } else if (this.element.contains(document.activeElement)) {
      // skip
    } else {
      this.element.focus();
    }
   
    this.updateSoftKeys();    
  }

  blur() {
    console.log('[Launcher] AppList blur');
    /*if (!this.element.contains(document.activeElement)) {
      this.setState({ focus: [0, 0] });
      this.goPage(0);
    }*/
  }

  focusIfPossible() {
    console.log('[Launcher] AppList focusIfPossible');
    if (!this.element.contains(document.activeElement)) {
      return;
    }
    /*let app = this.element.querySelector(`[data-row-index="${this.state.focus[0]}"][data-col-index="${this.state.focus[1]}"]`);
    console.log('[Launcher] AppList focusIfPossible app ' + app);
    if (!app) {
      this.element.focus();
      return;
    }
    app.focus();*/
  }

 
  openSheet(ref) {
    console.log('[Launcher] App openSheet ref :: '+ref);
     this.panels[ref].open();    
    this.manageAppState(ref, true);
  }

  closeSheet(ref) {
    console.log('[Launcher] App closeSheet  ref ' + ref);
    if (this.panels[ref].isClosed()) {
      return;
    }
    this.panels[ref].close();
    this.manageAppState(ref, false);
  }



  onKeyDown(evt) {
    let target = evt.target;
    let nextRowCol;
    let key = evt.key;

    switch (key) {
      case 'ArrowLeft':
      case 'ArrowRight':
        if (utils.isRtl()) {
          key = ('ArrowLeft' === key) ? 'ArrowRight' : 'ArrowLeft';
        }
        // break omitted
      case 'ArrowUp':
      case 'ArrowDown':
        if (!this.isAnimationEnd) {
          evt.preventDefault();
          return;
        }
        nextRowCol = utils.navGrid({
          currentRowCol: this.state.focus,
          dir: key,
          col: this.props.col,
          total: this.state.apps.length
        });
        break;
      case 'Call':
        new MozActivity({
          name: 'call-log'
        });
        break;
      case 'F2':
      case 'SoftRight':
        AppStore.toggle(target.dataset.manifestUrl, target.dataset.entry);
        break;
      case 'SoftLeft':
        if (this.targetApp.removable) {
          AppStore.uninstallApp(this.targetApp.mozApp);
        }
        break;
      case 'Enter':
        // launch app
        evt.target.click();
        break;
      case 'EndCall':
      case 'BrowserBack':
      case 'Backspace':
        // ensure app list is visible when closing app list
        if (!document.hidden) {
          this.setState({ focus: [0, 0] });
          this.goPage(0);
          AppStore.sort();
          Service.request('closeSheet', 'appList');
        }
        break;
      default:
        break;
    }
    if (nextRowCol) {
      evt.stopPropagation();
      evt.preventDefault();

      this.setState({
        focus: nextRowCol
      });
    }
  }

  appHandler(apps) {
    return apps.filter((app) => {
      return !app.shouldHide;
    });
  }

  getAppPageList() {
   return this.element.querySelectorAll('.page') ?
    this.element.querySelectorAll('.page') : []; 
  }

  setAppListContainerWidth() {
    if (this._container) {
      let allAppPages = this.getAppPageList();
      let containerWidth = (allAppPages.length * 100);// + (allAppPages.length * 5);
      console.log("page width ::" + containerWidth + "%");
      console.log("page Count ::" + allAppPages.length );

      if(containerWidth > 0) {
        this._container.style.width = containerWidth + "%";
        allAppPages.forEach((page,index)=> {
          page.style.width = (100 / allAppPages.length ) + "%";
        });
      }
    }
  }

  scrollAppContainer(left, isLeftSwipe) {
    console.log('[Launcher] AppList scrollAppContainer left :: ' + left + '    isLeftSwipe :: ' + isLeftSwipe);
    let currentPage = this.getAppPageList()[this.currentPage];

    let moveLeft = isLeftSwipe ? 
    currentPage.offsetLeft + left : currentPage.offsetLeft - left;
    console.log('[Launcher] AppList scrollAppContainer moveLeft :: ' + moveLeft );
    moveLeft = moveLeft - 10;
    this.scrollElement(moveLeft);
    
  }

  scrollOnPageChange(left, isLeftSwipe) {
    console.log('[Launcher] AppList scrollOnPageChange left :: ' + left );
    let currentPage = this.getAppPageList()[this.currentPage];
    let moveLeft = currentPage.offsetLeft ;//isLeftSwipe ? 
    //currentPage.offsetLeft  : currentPage.offsetLeft - left;
    console.log('[Launcher] AppList scrollOnPageChange moveLeft :: ' + moveLeft );
    moveLeft = moveLeft - 30;
    this.scrollElement(moveLeft);
  }

  scrollElement(moveLeft) {
    let app_conatiners = document.querySelector('.appList');
    let top = app_conatiners.offsetTop;
    console.log('[Launcher] AppList scrollElement moveLeft :: ' + moveLeft );
    let delta = this.previousPosition ? 
      Math.abs(moveLeft -  this.previousPosition): moveLeft;
    console.log('[Launcher] AppList scrollElement delta :: ' + delta );
    let step = Math.round(delta/25) > 0 ? Math.round(delta/25) : 1;
    let timer = 0;
    let moveElement = 0;
    let speed = Math.round(delta / 75);
    console.log('[Launcher] AppList scrollElement step :: ' + step );
    console.log('[Launcher] AppList scrollElement speed :: ' + speed );
    if (moveLeft > this.previousPosition) {
      moveElement = this.previousPosition + step;
      for(let i = this.previousPosition; i <= moveLeft; i+= step) {
        setTimeout(()=>{app_conatiners.scrollTo({left: moveElement, top: top, behaviour: 'smooth'});}, timer * speed);
        app_conatiners.scrollTo({left: moveElement, top: top, behaviour: 'smooth'});
        moveElement += step;
        if (moveElement > moveLeft) {
          moveElement = moveLeft;
        }
        timer++;
      } 
      //app_conatiners.scrollTo({left: moveLeft, top: top, behaviour: 'smooth'});
    } else {
      moveElement = this.previousPosition - step;
      for(let i = this.previousPosition; i >= moveLeft; i-= step) {
        setTimeout(()=>{app_conatiners.scrollTo({left: moveElement, top: top, behaviour: 'smooth'});}, timer * speed);
        //app_conatiners.scrollTo({left: moveElement, top: top, behaviour: 'smooth'});
        moveElement -= step;
        if (moveElement < moveLeft) {
          moveElement = moveLeft;
        }
        timer++;
      } 

    }
    this.previousPosition = moveLeft;
    return;
    //setTimeout(()=>{app_conatiners.scrollTo({left: moveLeft, top: top, behaviour: 'smooth'});}, 500);
  }

  getAppFolder(index, rowCol) {
    console.log('hi getappfolder, app is '+apps);
    let rowPerFolder = 3;
    let col = 3;
    let divs = [];
    let appFoler = [];
    let appsList = this.state.apps;//this.state.apps.splice(0, 9);
    let apps = appsList.slice(0,9);
    apps.forEach((app)=>{
      let elemDiv;
      let style = {
        backgroundImage: `url('${app.icon_url}')`,
        backgroundSize : '100%'
      };

      if (divs.length==2) {
        elemDiv = <div className='small_app_icon last_icon' style={style} ></div>
      } else {
        elemDiv = <div className='small_app_icon' style={style} ></div>
      }
      divs.push(
        elemDiv
      )
      if(divs.length === col) {
        appFoler.push(
        <row data-index={index}>
          {divs}
        </row>
        );
        divs = [];
      }
      
    });

    return (
    <div className='folder_icon'>
    <div className='folder_app_icon' 
      data-row-index={rowCol[0]}
      data-col-index={rowCol[1]}
      data-index={index}
      onClick={this.openFolder.bind(this)}>
       {appFoler}    
      </div>
       <span className="folder_iconname">Sample Folder</span>
      </div>
     
      );
  }

  getAppIcon(app,index,style,rowCol){

    console.log('hi getappicon, app is '+app);

    return (
      <div
          tabIndex="-1"
          role="menuitem"
          draggable="true"
          className={'app focusable'}
          key={app.uid}
          data-index={index}
          data-row-index={rowCol[0]}
          data-col-index={rowCol[1]}
          data-manifest-url={app.manifestURL}
          data-entry={app.entry || ''}
          data-favorite={app.isFavorite ? 'true' : 'false'}
          onClick={app.launch}
          onPress = {this.onAppPress}
        >
          <span className="badge hidden">3</span>
          
          <div className="app__icon" style={style} onClick={this.onAppClick.bind(this)}/>
          <div className="app__name">
            {app.name}
          </div>
        </div>
    );
  }
  
  
  render() {
    console.log('[Launcher] AppList render :: ' + this.state.apps.length);
    //console.log('[Launcher] AppList render col:: ' + this.props.col);
    //console.log('[Launcher] AppList render rowPerPage:: ' + this.props.row);
    let dom = [];
    let col = this.props.col;
    let row = [];
    let rowPerPage = this.props.row;
    let count = 0;
    let page = [];
    this.state.apps.forEach((app, index) => {
      let rowCol = utils.indexToRowCol(count, this.props.col);
      let style = {
        color: app.theme,
        backgroundImage: `url('${app.icon_url}')`
      };
     
      let isAppFolder=false;
      if (index == 0 || index == 2) {
        isAppFolder = true;
      }
      let ele= isAppFolder ? this.getAppFolder(index, rowCol) : this.getAppIcon(app,index,style,rowCol);
      //let ele = this.getAppIcon(app,index,style,rowCol);
      row.push(ele);
      console.log('AppList row length  '+row.length);
      console.log('AppList app name length  '+ app.name + '   index ' + index);

      if (row.length === col || index === this.state.apps.length - 1) {
        page.push(
          <div className="grid-row" key={`row${count}`}>
            {row}
          </div>
        );
        row = [];
      }
      if (dom.length === 0) {
        if (page.length === 3 || index === this.state.apps.length - 1) {
          dom.push(
            <div className="page" data-page-index={dom.length} key={`page${count}`}>
                
              <MainView ref={(node) => { this.mainView = node; }} />
              <div className="mainviewmargin"></div>
              {page}
            </div>
          );
          page = [];
        }
      } else {
        if (page.length === rowPerPage || index === this.state.apps.length - 1) {
          dom.push(
            <div className="page" data-page-index={dom.length} key={`page${count}`}>
              {page}
            </div>
          );
          page = [];
        }
      }
      
      count++;
    }, this);

    let pageLength = dom.length;
    // XXX: need a better way
    this.totalPage = pageLength;
    let paginationDOM;
    let currentPage =  this.getCurrentPage();//this.getPage(this.state.focus[0]);

    if (pageLength > 1) {
      let pages = [];
      for (let i = 0; pageLength > i; i++) {
        if (i === currentPage) {
          pages.push(<div className="page-indicator active" key={`page-indicator--${i}`} />);
        } else {
          pages.push(<div className="page-indicator" key={`page-indicator--${i}`} />);
        }
      }
      paginationDOM = <div className="pagination">{pages}</div>;
    }

    return (
      <div
        id="app-list"
        className="appList"
        tabIndex="-1"
        onKeyDown={this.onKeyDown}
        onFocus={this.onFocus}
        ref={(node) => { this.element = node; }}
      >
        
        {paginationDOM}
        <h1 className="readout-only" id="all-apps" data-l10n-id="all-apps" />
        <div
          className="appList__container" id="appList__container" role="heading" aria-labelledby="all-apps"
          ref={(ref) => (this._container = ref)}
        >
          {dom}
        
            <ToolTips  ref={(ref) => (this.toolTips = ref)}>
            </ToolTips>
          
        </div>
      </div>
    );
  }

}

//export default EnhanceAnimation(AppList, 'immediate', 'immediate');
