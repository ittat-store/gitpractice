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
    /*request.onsuccess = function () {
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

    }*/

    /*request.onerror = function () {
      console.log('Something goes wrong! ' + request.error.name);
    }*/
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
      var sdcard = navigator.b2g.getDeviceStorage("sdcard");   // B2G-API
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
    mediaElement = document.createElement('IMG');
    switch(file.type) {
      case 'image/jpeg':
        
        //let img_url = URL.createObjectURL(file); 
        mediaElement.setAttribute("src", img_url);
        mediaElement.setAttribute("class", 'mediathubmnail');
        break;
      case 'video/3gpp':
      case 'video/mp4':
        console.log('app_news  video :: ' + file.size);
        console.log('app News video Name ::'+ file.name);
        console.log('app_news  video img_url :: ' + img_url);

        this.getMetadata(file, (metadata) => {
          console.log("app_news video metadata " + Object.keys(metadata));
          console.log("app_news video metadata poster " + metadata.poster);
          let imgUrl = URL.createObjectURL(metadata.poster);
          //mediaElement = document.createElement('IMG');
          mediaElement.setAttribute("src", imgUrl);
          mediaElement.setAttribute("class", 'mediathubmnail');
        });
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
      //this.initVideoDB(inputValue);

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

  /**
  Video MetaData read
  */
  /*
 * Given a video File object, asynchronously pass an object of metadata to
 * the specified callback.
 */
getMetadata(videofile, callback) {

  /*
   * This is the video element that will get the metadata for us.
   * Because of an apparent bug in gecko, it needs to be here rather than
   * something that is shared globally.
   */
  const offscreenVideo = document.createElement('video');
  const metadata = {};
  let self = this;

  // If its a video type we don't know how to play, ignore it.
  if (!offscreenVideo.canPlayType(videofile.type)) {
    metadata.isVideo = false;
    callback(metadata);
    return;
  }

  // Create a blob: url for the file. It will be revoked in unload().
  const url = URL.createObjectURL(videofile);

  // Load the video into an offscreen <video> element.
  offscreenVideo.preload = 'metadata';
  offscreenVideo.src = url;

  offscreenVideo.onerror = (e) => {
    // Something went wrong. Maybe the file was corrupt?
    console.error("Can't play video", videofile.name, e);
    metadata.isVideo = false;
    unload();
    callback(metadata);
  };

  offscreenVideo.onloadedmetadata = () => {

    /*
     * If videoWidth is 0 then this is likely an audio file (ogg / mp4)
     * with an ambiguous filename extension that makes it look like a video.
     * This test only works correctly if we're using a new offscreen video
     * element each time. If I try to make the element a global, then it
     * retains the size of the last video when a non-video is loaded.
     */
    if (!offscreenVideo.videoWidth) {
      metadata.isVideo = false;
      unload();
      callback(metadata);
      return;
    }

    // Otherwise it is a video!
    metadata.isVideo = true;

    // Read title from metadata or fallback to filename.
    metadata.title = readFromMetadata('title') ||
                     fileNameToVideoName(videofile.name);

    // The video element tells us the video duration and size.
    metadata.duration = offscreenVideo.duration;
    metadata.width = offscreenVideo.videoWidth;
    metadata.height = offscreenVideo.videoHeight;

    if ((/.3gp$/u).test(videofile.name)) {
      this.getVideoRotation(videofile, (rotation) => {
        if (typeof rotation === 'number') {
          metadata.rotation = rotation;
        } else if (typeof rotation === 'string') {
          console.warn('Video rotation:', rotation);
        }
        createThumbnail();
      });
    } else {
      metadata.rotation = 0;
      createThumbnail();
    }
  };

  /*
   * The text case of key in metadata is not always lower or upper cases. That
   * depends on the creation tools. This function helps to read keys in lower
   * cases and returns the value of corresponding key.
   */
  function readFromMetadata(lowerCaseKey) {
    const tags = offscreenVideo.mozGetMetadata();
    // eslint-disable-next-line
    for (let key in tags) {
      // To lower case and match it.
      if (key.toLowerCase() === lowerCaseKey) {
        return tags[key];
      }
    }
    // No matched key, return ''.
    return '';
  }

  function createThumbnail() {

    /*
     * Videos often begin with a black screen, so skip ahead 5 seconds
     * or 1/10th of the video, whichever is shorter in the hope that we'll
     * get a more interesting thumbnail that way.
     * Because of bug 874692, corrupt video files may not be seekable,
     * and may not fire an error event, so if we aren't able to seek
     * after a certain amount of time, we'll abort and assume that the
     * video is invalid.
     */
    offscreenVideo.fastSeek(0);

    let failed = false; // Did seeking fail?
    const timeout = setTimeout(fail, 10000); // Fail after 10 seconds
    offscreenVideo.onerror = fail; // Or if we get an error event
    function fail() { // Seeking failure case
      console.warn('Seek failed while creating thumbnail for', videofile.name,
        '. Ignoring corrupt file.');
      failed = true;
      clearTimeout(timeout);
      offscreenVideo.onerror = null;
      metadata.isVideo = false;
      unload();
      callback(metadata);
    }
    offscreenVideo.onseeked = () => { // Seeking success case
      // Avoid race condition: if we already failed, stop now
      if (failed) {
        return;
      }
      clearTimeout(timeout);
      self.captureFrame(offscreenVideo, metadata, (poster) => {
        metadata.poster = poster;
        unload();
        callback(metadata); // We've got all the metadata we need now.
      }, offscreenVideo.videoWidth, offscreenVideo.videoHeight);
    };
  }

  // Free the resources being used by the offscreen video element
  function unload() {
    URL.revokeObjectURL(url);
    URL.revokeObjectURL(offscreenVideo.src);
    offscreenVideo.removeAttribute('src');
    offscreenVideo.load();
  }

  // Derive the video title from its filename.
  function fileNameToVideoName(filename) {
    filename = filename.split('/').pop()
      .replace(/\.(webm|ogv|ogg|mp4|3gp)$/u, '');
    return filename.charAt(0).toUpperCase() + filename.slice(1);
  }
}

captureFrame(player, metadata, callback, width, height) {
  // Create a new canvas, and set its size
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d', { willReadFrequently: true });
  try {
    canvas.width = width || CANVAS_WIDTH;
    canvas.height = height || CANVAS_HEIGHT;

    // Draw the current video frame into the image
    ctx.drawImage(player, 0, 0, canvas.width, canvas.height);

    // Convert it to an image file and pass to the callback.
    canvas.toBlob(done, 'image/jpeg');
  } catch (e) {
    console.error('Exception in captureFrame:', e, e.stack);
    done(null);
  }

  function done(blob) {
    canvas.width = 0; // Free canvas memory
    ctx = null; // Prevent leaks, just to be safe
    canvas = null;
    callback(blob); // Return the frame thumbnail to the caller
  }
}


//
// Given an MP4/Quicktime based video file as a blob, read through its
// atoms to find the track header "tkhd" atom and extract the rotation
// matrix from it. Convert the matrix value to rotation in degrees and
// pass that number to the specified callback function. If no value is
// found but the video file is valid, pass null to the callback. If
// any errors occur, pass an error message (a string) callback.
//
// See also:
// http://androidxref.com/4.0.4/xref/frameworks/base/media/libstagefright/MPEG4Writer.cpp
// https://developer.apple.com/library/mac/#documentation/QuickTime/QTFF/QTFFChap2/qtff2.html
//
getVideoRotation(blob, rotationCallback) {

  // A utility for traversing the tree of atoms in an MP4 file
  function MP4Parser(blob, handlers) {
    // Start off with a 1024 chunk from the start of the blob.
    BlobView.get(blob, 0, Math.min(1024, blob.size), function(data, error) {
      // Make sure that the blob is, in fact, some kind of MP4 file
      if (data.byteLength <= 8 || data.getASCIIText(4, 4) !== 'ftyp') {
        handlers.errorHandler('not an MP4 file');
        return;
      }
      parseAtom(data);
    });

    // Call this with a BlobView object that includes the first 16 bytes of
    // an atom. It doesn't matter whether the body of the atom is included.
    function parseAtom(data) {
      var offset = data.sliceOffset + data.viewOffset; // atom position in blob
      var size = data.readUnsignedInt();               // atom length
      var type = data.readASCIIText(4);                // atom type
      var contentOffset = 8;                           // position of content

      if (size === 0) {
        // Zero size means the rest of the file
        size = blob.size - offset;
      }
      else if (size === 1) {
        // A size of 1 means the size is in bytes 8-15
        size = data.readUnsignedInt() * 4294967296 + data.readUnsignedInt();
        contentOffset = 16;
      }

      var handler = handlers[type] || handlers.defaultHandler;
      if (typeof handler === 'function') {
        // If the handler is a function, pass that function a
        // DataView object that contains the entire atom
        // including size and type.  Then use the return value
        // of the function as instructions on what to do next.
        data.getMore(data.sliceOffset + data.viewOffset, size, function(atom) {
          // Pass the entire atom to the handler function
          var rv = handler(atom);

          // If the return value is 'done', stop parsing.
          // Otherwise, continue with the next atom.
          // XXX: For more general parsing we need a way to pop some
          // stack levels.  A return value that is an atom name should mean
          // pop back up to this atom type and go on to the next atom
          // after that.
          if (rv !== 'done') {
            parseAtomAt(data, offset + size);
          }
        });
      }
      else if (handler === 'children') {
        // If the handler is this string, then assume that the atom is
        // a container atom and do its next child atom next
        var skip = (type === 'meta') ? 4 : 0; // special case for meta atoms
        parseAtomAt(data, offset + contentOffset + skip);
      }
      else if (handler === 'skip' || !handler) {
        // Skip the atom entirely and go on to the next one.
        // If there is no next one, call the eofHandler or just return
        parseAtomAt(data, offset + size);
      }
      else if (handler === 'done') {
        // Stop parsing
        return;
      }
    }

    function parseAtomAt(data, offset) {
      if (offset >= blob.size) {
        if (handlers.eofHandler)
          handlers.eofHandler();
        return;
      }
      else {
        data.getMore(offset, 16, parseAtom);
      }
    }
  }

  // We want to loop through the top-level atoms until we find the 'moov'
  // atom. Then, within this atom, there are one or more 'trak' atoms.
  // Each 'trak' should begin with a 'tkhd' atom. The tkhd atom has
  // a transformation matrix at byte 48.  The matrix is 9 32 bit integers.
  // We'll interpret those numbers as a rotation of 0, 90, 180 or 270.
  // If the video has more than one track, we expect all of them to have
  // the same rotation, so we'll only look at the first 'trak' atom that
  // we find.
  MP4Parser(blob, {
    errorHandler: function(msg) { rotationCallback(msg); },
    eofHandler: function() { rotationCallback(null); },
    defaultHandler: 'skip',  // Skip all atoms other than those listed below
    moov: 'children',        // Enumerate children of the moov atom
    trak: 'children',        // Enumerate children of the trak atom
    tkhd: function(data) {   // Pass the tkhd atom to this function
      // The matrix begins at byte 48
      data.advance(48);

      var a = data.readUnsignedInt();
      var b = data.readUnsignedInt();
      data.advance(4); // we don't care about this number
      var c = data.readUnsignedInt();
      var d = data.readUnsignedInt();

      if (a === 0 && d === 0) { // 90 or 270 degrees
        if (b === 0x00010000 && c === 0xFFFF0000)
          rotationCallback(90);
        else if (b === 0xFFFF0000 && c === 0x00010000)
          rotationCallback(270);
        else
          rotationCallback('unexpected rotation matrix');
      }
      else if (b === 0 && c === 0) { // 0 or 180 degrees
        if (a === 0x00010000 && d === 0x00010000)
          rotationCallback(0);
        else if (a === 0xFFFF0000 && d === 0xFFFF0000)
          rotationCallback(180);
        else
          rotationCallback('unexpected rotation matrix');
      }
      else {
        rotationCallback('unexpected rotation matrix');
      }
      return 'done';
    }
  });
}


  /**/

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

