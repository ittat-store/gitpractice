function getThumbnail(contact) {
  return getOnePhoto(contact, 'begin');
}

function getFullResolution(contact) {
  return getOnePhoto(contact, 'end');
}

function getOnePhoto(contact, position) {
  if (!contact || !contact.photo || !contact.photo.length) {
    return null;
  }

  if (1 === contact.photo.length) {
    return contact.photo[0];
  }

  // For FB Linked contacts we need to give preference to the local photo
  // [0] is the full resolution photo and [1] is the thumbnail
  let photos = contact.photo;
  let category = contact.category;
  if (Array.isArray(category) && category.indexOf('fb_linked') !== -1) {
    // Check whether we have a new linked contact or a legacy contact
    if (photos.length >= 4) {
      return photos[('begin' === position) ? 1 : 0];
    }
    // In the case of a legacy contact we always return full resolution
    // in order to ensure we are always giving preference to local photo
    return photos[0];
  }

  photos = photosBySize(contact);
  let index = ('begin' === position) ? 0 : photos.length - 1;
  return photos[index];
}

function photosBySize(contact) {
  var photos = contact.photo.slice(0);
  photos.sort((p1, p2) => {
    if (size(p1) < size(p2)) {
      return -1;
    }
    if (size(p1) > size(p2)) {
      return 1;
    }
    return 0;
  });

  return photos;
}

// For legacy purpose we support data URLs and blobs
function size(photo) {
  if ('string' === typeof photo) {
    return photo.length; // length of the data URL
  }

  return photo.size; // size of the blob in bytes
}

function getPhotoHeader(contact, contactName) {
  if (contact && contact.photo && contact.photo.length) {
    let contactImage = getThumbnail(contact);
    return getPhotoHeaderByImg(contactImage);
  } else {
    return getDefaultImage(contact, contactName);
  }
}

function getFirstLetter(/* contact, contactName */) {
  // temporarily return an empty
  return '';
}

function getDefaultImage(contact, contactName) {
  let pictureContainer = document.createElement('span');
  pictureContainer.classList.add('defaultPicture');
  pictureContainer.classList.add('contactHeaderImage');
  pictureContainer.setAttribute('style', '');
  let posVertical = ['top', 'center', 'bottom'];
  let posHorizontal = ['left', 'center', 'right'];
  let positionX = posHorizontal[Math.floor(Math.random() * posHorizontal.length)];
  let positionY = posVertical[Math.floor(Math.random() * posVertical.length)];
  let position = `${positionX} ${positionY}`;
  pictureContainer.dataset.group = getFirstLetter(contact, contactName);
  pictureContainer.style.backgroundPosition = position;
  return pictureContainer;
}

function getPhotoHeaderByImg(contactImage) {
  let photoView = document.createElement('span');
  photoView.classList.add('contactHeaderImage');
  try {
    photoView.dataset.src = window.URL.createObjectURL(contactImage);
    photoView.setAttribute('style', `background-image:url(${photoView.dataset.src})`);
    return photoView;
  } catch (err) {
    console.warn(`Failed to create contact picture : ${contactImage}, error: ${err}`);
  }
}

const ContactPhotoHelper = {
  getThumbnail: getThumbnail,
  getFullResolution: getFullResolution,
  getPhotoHeader: getPhotoHeader
};

export default ContactPhotoHelper;
