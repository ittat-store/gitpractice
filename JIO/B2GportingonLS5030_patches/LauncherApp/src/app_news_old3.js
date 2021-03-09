import React from 'react';
import BaseComponent from './base_component';
import EnhanceAnimation from 'enhance-animation';
import AppStore from './app_store';
import '../style/scss/app_news.scss';

class AppNews extends BaseComponent {
  name = 'AppNews';
  

  constructor(props) {
    super(props);
    this.state = {
      apps: [],
      appNameList:[]
    };

    this.onSearchAppList = this.onSearchAppList.bind(this);
    this.suportedTypes = ['image/jpeg', 'video/3gpp', 'video/mp4'];
  }

  start() {
  }

  stop() {
  }

  show() {
    console.log('[Launcher] AppNews show');
    document.querySelector('.appnewsparent').classList.remove('hidden');
    //this.element.classList.remove('hidden');
  }

  hide() {
    console.log('[Launcher] AppNews hide');
    document.querySelector('.appnewsparent').classList.add('hidden');
    //this.element.classList.add('hidden');
  }

  componentDidMount() {
    this.store = AppStore;
    AppStore.on('ready', () => {
      this.setState({
        apps: AppStore.apps,
        appNameList: AppStore.appNameList
      });
      document.querySelector('.recommend_search').addEventListener('input', this.onSearchAppList);

      //console.log('[Launcher] AppTray componentDidMount apps :: ' + this.state.apps.length);
    });
  }

  initVideoDB(str) {
    let videodb = new MediaDB('videos', null);
    videodb.isEnumerateing = false;
    let self = this;
    console.log('initVideoDB  enumerateDB videodb ' + videodb);
    videodb.onenumerable = () => {
      console.log('initVideoDB  onenumerable enumerateDB');
      self.enumerateDB(videodb, str);
    };
  }

  enumerateDB(videodb, str) {
    let batch = [];
    let enumerate = null;
    const enumerateEntry = (videoinfo) => {
      // When we're done with the enumeration flush any batched files

      console.log('initVideoDB enumerateDB  videoinfo ' + videoinfo);
      if (videoinfo === null) {
        batch = [];
        enumerate.state === 'complete';
        return;
      }
      const { isVideo } = videoinfo.metadata;

      console.log('initVideoDB enumerateDB  videoinfo metaData rotation ' + videoinfo.rotation);
      console.log('initVideoDB enumerateDB  videoinfo metaData ' + videoinfo.metadata);
      // If we know this is not a video, ignore it
      if (typeof isVideo === 'undefined' || isVideo === false) {
        return;
      }
      console.log('initVideoDB enumerateDB  videoinfo metadata ' + JSON.stringify(videoinfo.metadata));

      // If we've parsed the metadata and know this is a video, display it.
      if (isVideo === true) {
        batch.push(videoinfo);
      }
    };
    enumerate = videodb.enumerate('date', null, 'prev', enumerateEntry);
  }

  getSearchContacts(str) {
   /* var filter = {
      filterBy: ['name', 'nickname', 'firstName'],
      filterValue: str.toLowerCase(),
      filterOp: 'equals',
      filterLimit: 100
    };*/

    let filter = {
      sortBy: name,
    };
    //let request = navigator.mozContacts.getAll(filter);   // B2G-API
    let matchedContacts = [];
    let self = this;
    request.onsuccess = function () {
      if (request.result) {
        console.log("Name of Contact " + request.result.name);
        let contactName = request.result.name;
        contactName = contactName.toString().toLowerCase();

        // Display the Mobile number of the contact
        console.log("Number of Contact " + request.result.tel[0].value);
        if (contactName.search(str.toLowerCase()) > -1) {
          matchedContacts.push(request.result);
        }
        request.continue();
      }
      if(request.done) {
        self.showSearchedContact(matchedContacts);
      }

    }

    request.onerror = function () {
      console.log('Something goes wrong! ' + request.error.name);
    }
  }

  showSearchedContact(foundContact) {
    let resultRow = document.querySelector('.result_row_contacts');
    
    let resultContact = document.querySelector('.contacts_result');
    if (foundContact.length > 0) {
      resultRow.classList.remove('hidden');
      resultContact.innerHTML = '';
      foundContact.forEach((contact, index)=>{
        console.log('Contacts found :: ' + JSON.stringify(contact));
        let app_box = document.createElement('DIV');
        let app_icon = document.createElement('IMG');
        let app_name = document.createElement('SPAN');
        let img_url = contact.url ? contact.url : "images/ic_default_contact.png";
        app_name.setAttribute("class", "app_name");
        app_name.innerHTML = contact.name;
        app_icon.setAttribute("src", img_url);
        app_icon.setAttribute("class", 'small_contact_icons');
        app_box.setAttribute("class", "contact_box");
        app_box.appendChild(app_icon);
        app_box.appendChild(app_name);
        resultContact.appendChild(app_box);
      });
    } else {
      resultRow.classList.add('hidden');
      resultContact.innerHTML = '';

    }
  }

  getSearchAppList(str) {
    console.log("hi mice ji , str is "+str);
    let appList = [];
    this.state.apps.forEach(app => {
      let appName = app.name.toLowerCase();
      if (appName.search(str.toLowerCase()) > -1 && !app.shouldHide) {
        appList.push(app);
        console.log('hello mice, app is '+app.name);
        console.log('hello mice, app is '+app.icon_url);
      }
    });
    return appList;
  }

  getDeviceStorageFiles(str) {
    let matchedFiles = {
      'images': [],
      'videos': [],
      'documents': []
    };
    let self = this;
    return new Promise((resolve, reject) => {
      //var sdcard = navigator.getDeviceStorage("sdcard");  // B2G-API
      var cursor = sdcard.enumerate();

      cursor.onsuccess = function () 
      {
        console.log("File updated on: result  " + cursor.result);
        if (cursor.result) {
          let file = this.result;
          console.log("File updated File Name: " + file.name);
          console.log("File updated File Type: " + file.type);
          console.log("File updated File str: " + str);
          let filename = file.name.toLowerCase();
          if(self.suportedTypes.includes(file.type)  &&
           filename.search(str.toLowerCase()) > -1) {
            switch(file.type) {
              case 'image/jpeg':
                matchedFiles.images.push(file);
              break;
              case 'video/mp4':
              case 'video/3gpp':
                matchedFiles.videos.push(file);
              break;
            }
            
            console.log('File updated matched : ' + file.name);
          }
          // Once we found a file we check if there are other results
          // Then we move to the next result, which calls the cursor
          // success possibly with the next file as result.
          cursor.continue();
        }
        if(cursor.done) {
          self.showSearchedFiles(matchedFiles);
          resolve(matchedFiles);
        }
      }
      cursor.onerror = function () {
        console.log("File error   " + cursor.error.name);
        reject();
      }
    });
  }

  showSearchedFiles(matchedFiles) {
    
    this.showSearchedImages(matchedFiles.images);
    this.showSearchedVideos(matchedFiles.videos);
  }

  showSearchedVideos(matchedVideos) {
    let resultRowFiles = document.querySelector('.result_row_videos');
    let resultFiles = document.querySelector('.videos_result');
    let self = this;
    if (matchedVideos.length > 0) {
      resultFiles.innerHTML = '';
      matchedVideos.forEach((file)=> {
        let app_box_file = document.createElement('DIV');
        app_box_file.setAttribute("class", "media_box");
        app_box_file.appendChild(self.getMediaElements(file));
        resultFiles.appendChild(app_box_file);
        resultRowFiles.classList.remove('hidden');
        console.log("matchedFiles File Name: " + file.name);
        console.log("matchedFiles File Type: " + file.type);
      });

    } else {
      resultRowFiles.classList.add('hidden');
      resultFiles.innerHTML = '';
    }
  }

  showSearchedImages(matchedImages) {
    let resultRowFiles = document.querySelector('.result_row_images');
    let resultFiles = document.querySelector('.images_result');
    let self = this;
    if(matchedImages.length > 0) {
      resultFiles.innerHTML = '';
      matchedImages.forEach((file)=> {
        let app_box_file = document.createElement('DIV');
        app_box_file.setAttribute("class", "media_box");
        app_box_file.appendChild(self.getMediaElements(file));
        resultFiles.appendChild(app_box_file);
        resultRowFiles.classList.remove('hidden');
        console.log("matchedFiles File Name: " + file.name);
        console.log("matchedFiles File Type: " + file.type);
      });

    } else {
      resultRowFiles.classList.add('hidden');
      resultFiles.innerHTML = '';
    }

  }

  getMediaElements(file) {
    let mediaElement;
    let img_url = URL.createObjectURL(file); 
    switch(file.type) {
      case 'image/jpeg':
        mediaElement = document.createElement('IMG');
        //let img_url = URL.createObjectURL(file); 
        mediaElement.setAttribute("src", img_url);
        mediaElement.setAttribute("class", 'mediathubmnail');
        break;
      case 'video/3gpp':
      case 'video/mp4':
        console.log('app_news  video :: ' + file.size);
        console.log('app News video Name ::'+ file.name);
        console.log('app_news  video img_url :: ' + img_url);

        

       // console.log("Dat files "+img_url.data);
        //let img_url = URL.createObjectURL(file); 
        mediaElement = document.createElement('VIDEO');
        mediaElement.setAttribute("class", 'videothubmnail');
      
        // var videoURL =  window.URL.createObjectURL(img_url);
        //mediaElement.setAttribute("src", img_url);
        mediaElement.style.width= "100px";
        mediaElement.style.height= "100px";
        mediaElement.controls ="";
        mediaElement.preload = "auto";
        
       // console.log('app_news  video :: ' + mediaElement.videoWidth);
        
        let source = document.createElement('SOURCE');
        source.setAttribute("src", img_url);
        source.setAttribute("type", "video/3gpp");
        mediaElement.appendChild(source);
        mediaElement.load();
        break;
    }
    return mediaElement;
  }

  onSearchAppList() {
    
     // Mobile File Search
    let inputValue = document.querySelector('.recommend_search').value;
    let resultRowApps = document.querySelector('.result_row_app');
    
    let resultApps = document.querySelector('.apps_result');
    
    console.log(this);
    let self = this;
    console.log('[Launcher] AppNews onSearchAppList ' + inputValue);
    let appList = [];
    if(inputValue && inputValue.length > 1) {
      appList = this.getSearchAppList(inputValue);
      this.getDeviceStorageFiles(inputValue);
      this.getSearchContacts(inputValue);
      this.initVideoDB(inputValue);

    } else {
      
      this.hideSearchResult();
    }

    //Mobile apps Search
    resultApps.innerHTML=''; 
  
    console.log('[Launcher] Applistss::' + " App list "+appList.length);
    
    if(appList.length > 0)
    {
      appList.forEach((app) => {
      console.log('[Launcher] Inside App array,  app name is::' + " App name "+app.name + "App Type "+app.type);
  
      let img_url = app.icon_url;
     
      resultRowApps.classList.remove('hidden');
      let app_box = document.createElement('DIV');
      let app_icon = document.createElement('IMG');
      let app_name = document.createElement('SPAN');
      app_name.setAttribute("class", "app_name");
      app_name.innerHTML = app.name;
      app_icon.setAttribute("src", img_url);
      app_icon.setAttribute("class", 'small_app_icons');
      app_icon.addEventListener('click', app.launch); 
      app_box.setAttribute("class", "app_box");
      app_box.appendChild(app_icon);
      app_box.appendChild(app_name);
      resultApps.appendChild(app_box); 
      
       });
     
    } else {
      resultRowApps.classList.add('hidden');
      resultApps.innerHTML='';
    }
    
  }

  hideSearchResult() {
    let resultRowApps = document.querySelector('.result_row_app');
    let resultRowImages = document.querySelector('.result_row_images');
    let resultRowContats = document.querySelector('.result_row_contacts');
    let resultRowVideos = document.querySelector('.result_row_videos');
    let resultRowMusics = document.querySelector('.result_row_musics');
    let resultRowDocuments = document.querySelector('.result_row_documents');
    resultRowApps.classList.add('hidden');
    resultRowImages.classList.add('hidden');
    resultRowContats.classList.add('hidden');
    resultRowVideos.classList.add('hidden');
    resultRowMusics.classList.add('hidden');
    resultRowDocuments.classList.add('hidden');
  }

  render() {

    return (
      <div id='recommendations_cont'  className="recommendparent" ref={(node) => { this.element = node; }}>
        <div className="recommend_first_child">
          <div className="first_child recommend_row">
          <img className="recommend_img search_img" src='images/search_icon.png' />
           <input type="text" className="recommend_search" placeholder="Search" ></input>
           <img className="recommend_img mic_img" src='images/mic_disabled.png'/>
          </div>

          {/* blob:https://vimeo.com/f2131345-fac6-4ec4-8038-4dc5ed27b2ff */}
{/* 
          <div className="videoz">
        <video className="videox"  width="400" and height="240" preload="auto" controls>
          <source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-3gp-file.3gp" type="video/3gpp"></source>
        </video>
          </div> */}

        {/* <div className="videoz">
        <video className="videox" width="400" and height="240" controls>
          <source src="blob:https%3A//www.youtube.com/23aea5c8-9ae2-40dc-9417-e675ea99b386" ></source>
        </video>
          </div> */}

          <div className="result_row_app recommend_row hidden">
              <div className='title'>
                  <img className='small_icon' src='images/default_app_56.png' />
                  <span className='title_text'>Apps</span>
                </div>
                <div className="apps_result"></div>
              </div>
          <div className="result_row_images recommend_row hidden">
                <div className='title'>
                  <img className='small_icon' src='images/brightness.png' />
                  <span className='title_text'>Images</span>
                </div>
                <div className="images_result"></div>  
          </div>
          <div className="result_row_videos recommend_row hidden">
                <div className='title'>
                  <img className='small_icon' src='images/brightness.png' />
                  <span className='title_text'>Videos</span>
                </div>
                <div className="videos_result"></div>  
          </div>
          <div className="result_row_musics recommend_row hidden">
                <div className='title'>
                  <img className='small_icon' src='images/brightness.png' />
                  <span className='title_text'>Videos</span>
                </div>
                <div className="musics_result"></div>  
          </div>
          <div className="result_row_documents recommend_row hidden">
                <div className='title'>
                  <img className='small_icon' src='images/brightness.png' />
                  <span className='title_text'>Videos</span>
                </div>
                <div className="documents_result"></div>  
          </div>
          <div className="result_row_contacts recommend_row hidden">
                <div className='title'>
                  <img className='small_icon' src='images/camera.png' />
                  <span className='title_text'>Contacts</span>
                </div>
                <div className="contacts_result"></div>  
          </div>
          </div>
    
        <div className="recommend_child">
          <div className="recommend_row">
            <img className='small_icon' src='images/weather_icon_orange_small.png' />
            <span>Weather</span>
            <span className='info_value'>23° Overcast</span>
            <div className="clearfix"></div>
          </div>
        </div>


        <div className="recommend_child">
          <div className="recommend_row">
            <img className='small_icon' src='images/alarm.png' />
            <span>Recommended for you</span>
            <span className='time_value'>12:04</span>
            <div className="clearfix"></div>
          </div>
          <div className="recommend_app">
            <div className="card small_app_tile">
              <div className="app_icon">
                <img src='images/alarm.png' />
              </div>
                <div className="app_name">
                  App_name
                </div>
            </div>
            <div className="card small_app_tile">
              <div className="app_icon">
               <img src='images/alarm.png' />
             </div>
                <div className="app_name">
                App_name
              </div>
            </div>
            <div className="card small_app_tile">
              <div className="app_icon">
                  <img src='images/alarm.png' />
                </div>
                <div className="app_name">
                App_name
                </div>
            </div>
            <div className="card small_app_tile">
              <div className="app_icon">
                  <img src='images/alarm.png' />
                </div>
                <div className="app_name">
                App_name
                </div>
            </div>
            <div className="card small_app_tile">
              <div className="app_icon">
                  <img src='images/alarm.png' />
                </div>
                <div className="app_name">
                App_name
              </div>
            </div>
            <div className="card small_app_tile">
              <div className="app_icon">
                  <img src='images/alarm.png' />
                </div>
                <div className="app_name">
                App_name
                </div>
            </div>
          </div>
        </div>


        <div className="recommend_child">
          <div className="recommend_row">
            <img className='small_icon' src='images/alarm.png' />
            <span>Recommended for you</span>
            <span className='time_value'>12:04</span>
            <div className="clearfix"></div>
          </div>
          <div className="recommend_app">
            <div className="card">
                <div className="app_video"></div>
                <div className="video_name">
                  Title
                </div>
            </div>
            <div className="card">
                <div className="app_video"></div>
                <div className="video_name">
                  Title
                </div>
            </div>
            <div className="card">
                <div className="app_video"></div>
                <div className="video_name">
                  Title
                </div>
            </div>
          </div>
        </div>



        <div className="recommend_child">
          <div className="recommend_row">
            <img className='small_icon' src='images/alarm.png' />
            <span>Alarm</span>
            <span className='info_value'>6:00 AM</span>
            <span className='extra_info'>Next Alarm</span>
            <div className="clearfix"></div>
          </div>
        </div>


        <div className="recommend_child">
          <div className="recommend_row">
            <img className='small_icon' src='images/alarm.png' />
            <span>Calendar</span>
            <span className='info_value'>Arjun's Birthday</span>
            <span className='extra_info'>Today</span>
            <div className="clearfix"></div>
          </div>
        </div>



        <div className="recommend_child">
          <div className="recommend_row">
            <img className='small_icon' src='images/alarm.png' />
            <span>New Games for you</span>
            <span className='time_value'>12:04</span>
            <div className="clearfix"></div>
          </div>
          <div className="recommend_app">
            <div className="card">
                <div className="app_video"></div>
                <div className="video_name">
                  Title
              </div>
            </div>
            <div className="card">
                <div className="app_video"></div>
                <div className="video_name">
                  Title
                </div>
            </div>
            <div className="card">
                <div className="app_video"></div>
                <div className="video_name">
                  Title
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default EnhanceAnimation(AppNews, 'immediate', 'immediate');

