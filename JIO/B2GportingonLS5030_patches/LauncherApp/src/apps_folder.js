import React from 'react';
import BaseComponent from './base_component';
import EnhanceAnimation from 'enhance-animation';
import AppStore from './app_store';
import * as utils from 'util/utils';
import '../style/scss/apps_folder.scss';


export default class AppsFolder extends BaseComponent {
  name = 'AppsFolder';

  constructor(props) {
    super(props);
    this.state = {
      apps: [],
      focus: [0, 0]
    };
    this.currentPage = 0;
  }

  start() {
  }

  stop() {
  }

  fouce() {
    console.log('[Launcher] AppsFolder fouce');
  }

  show(){
    console.log('[Launcher] AppsFolder show');
    document.querySelector('.appsfolder_parent').classList.remove('hidden');

   }
  hide() {
    console.log('[Launcher] AppsFolder hide');
    document.querySelector('.appsfolder_parent').classList.add('hidden');
  }

  goPage(p, isLeftSwipe=true) {

    let allPages = this.element.querySelectorAll('.page');
    let page = allPages && allPages[p];
    console.log('[Launcher] AppList goPage p : ' + p);
    if (!page) {
      return;
    }

    //this.focusIfPossible();
    this.currentPage = p;

    let appList_con = document.getElementById('app_folder');
    /*if(isLeftSwipe) {
      appList_con.classList.remove('animateLeftToRight');
      appList_con.classList.add('animateRightToLeft');
    } else {
      appList_con.classList.remove('animateRightToLeft');
      appList_con.classList.add('animateLeftToRight');
    }*/

    //if (p > 0) {
      console.log('[Launcher] AppList  emit page change');
      //this.emit('appTray');
      let top = page.offsetTop - this._container.offsetTop;
      this._container.scrollTo({ left: 0, top: top });
      //appList_con.style.top = 0;
    /*} else if (p == 0) {
      this.emit('appTray');
      appList_con.style.top = "25rem";
      let top = page.offsetTop - this._container.offsetTop;
      this._container.scrollTo({ left: 0, top: top });
    }*/
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


  appHandler(apps) {
    return apps.filter((app) => {
      return !app.shouldHide;
    });
  }

  onAppClick(e) {
    
  }

  componentDidMount() {
    AppStore.on('ready', () => {
      this.setState({
        apps: this.appHandler(AppStore.apps)
      }, () => {
        AppStore.update();
        AppStore.sort();
      });
    });
    AppStore.on('change', (evt) => {
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
        //this.focusIfPossible();
      });
    });
  }
  // closeFolder(){
  //   console.log("you clicked the close button");
  //   //document.querySelector('.appsfolder_parent').classList.add('hidden');
  //   this.emit('appFolderClose');
  // }

  closeFolder(){
      console.log("you clicked the close button");
    //document.querySelector('.appsfolder_parent').classList.add('hidden');

    document.getElementById("app_folder").animate(
      [
      {opacity: '0.9'}, 
      // {opacity: '0.75'}, 
      // {opacity: '0.5'}, 
      {opacity:'0.0'}
     ], 
      { 
      duration: 300,
      iterations: 1
      }); 
      
     
    //  setTimeout(()=>
    //   {
        
    //   },300);

      this.emit('appFolderClose');
   
  }

  render() {
    let dom = [];
    let col = 3;
    let row = [];
    let rowPerPage = 4;
    let count = 0;
    let page = [];
    this.state.apps.forEach((app, index) => {
      console.log('[Launcher] AppsFolder render :: ' + app.name);
      let rowCol = utils.indexToRowCol(count, col);
      let style = {
        color: app.theme,
        backgroundImage: `url('${app.icon_url}')`
      };
      row.push(
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
        >
          <span className="badge hidden">3</span>
          
          <div className="app__icon" style={style} onClick={this.onAppClick.bind(this)}/>
          <div className="app__name">
            {app.name}
          </div>
        </div>
      );

      if (row.length === col || index === this.state.apps.length - 1) {
        page.push(
          <div className="grid-row" key={`row${count}`}>
            {row}
          </div>
        );
        row = [];
      }
      
      if (page.length === rowPerPage || index === this.state.apps.length - 1) {
        dom.push(
          <div className="page" data-page-index={dom.length} key={`page${count}`}>
              {page}
          </div>
        );
          page = [];
      }
      
      
      count++;
    }, this);

    let pageLength = dom.length;
    // XXX: need a better way
    this.totalPage = pageLength;
    let paginationDOM;
    let currentPage =  0;//this.getPage(this.state.focus[0]);

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
     
      <div id="app_folder" 
      className="appsfolder_parent hidden"
      ref={(node) => { this.element = node; }} >
        <h2 className='list_heading'>Sample Folder</h2>
        <div className="appsList">
          {paginationDOM}
        <h1 className="readout-only" id="all-apps" data-l10n-id="all-apps" />
        <div
          className="appList__container" role="heading" aria-labelledby="all-apps"
          ref={(ref) => (this._container = ref)} >
          {dom}
        </div>
        </div>
        <div className='tab_bars'>
        <hr className='first_bar' onClick={this.closeFolder.bind(this)}></hr>
        <hr className='second_bar' onClick={this.closeFolder.bind(this)}></hr>
        <hr className='third_bar'></hr>
      </div>
      </div>
    );
  }
}


