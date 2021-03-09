/* global MozActivity */
import ContactPhotoHelper from 'contact_photo_helper';

export function toL10n(id = '', args = {}) {
  /*if ('complete' !== navigator.mozL10n.readyState || !id) {  // B2G-API
    return id;
  }*/
  id += '';
  //return navigator.mozL10n.get(id, args) || id;  // B2G-API
}

export function sendNumberToContact({ name = 'new', telNum = '' } = {}) {
  new MozActivity({
    name,
    data: {
      type: 'webcontacts/contact',
      params: {
        tel: telNum
      }
    }
  });
}

export function pickContact(cb) {
  let activity = new MozActivity({ name: 'pick', data: { type: 'webcontacts/tel' } });
  activity.onsuccess = cb;
  activity.onerror = () => {
    console.warn('Activity error', activity.error.name);
  };
}

export function simpleClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// === Math.min(max, Math.max(min, num))
export function clamp(num, min = 0, max = 2) {
  return (num <= min) ? min : ((num >= max) ? max : num);
}

export function rowColToIndex(rc = [0, 0], col = 3) {
  return (rc[0] * col) + rc[1];
}

export function indexToRowCol(index, col = 3) {
  return [Math.floor(index / col), index % col];
}

export const isLandscape = screen.orientation.type.startsWith('landscape');

export function isRtl() {
  return 'rtl' === document.dir;
}

export function navGrid({ currentRowCol = [0, 0], dir, col = 3, total } = {}) {
  let currentIndex = rowColToIndex(currentRowCol, col);
  let totalRows = Math.ceil(total / col);
  let totalGrid = totalRows * col;
  let lastIndex = total - 1;

  switch (dir) {
    case 'ArrowRight':
      currentIndex = (total + (currentIndex + 1)) % total;
      break;
    case 'ArrowLeft':
      currentIndex = (total + (currentIndex - 1)) % total;
      break;
    case 'ArrowUp':
      currentIndex = clamp((totalGrid + (currentIndex - col)) % totalGrid, 0, lastIndex);
      break;
    case 'ArrowDown':
      currentIndex = clamp((totalGrid + (currentIndex + col)) % totalGrid, 0, lastIndex);
      break;
    default:
      break;
  }

  return indexToRowCol(currentIndex, col);
}

export function contactNumFilter({ telNum } = {}) {
  return new Promise((resolve, reject) => {
   /* let request = navigator.mozContacts.find({    // B2G-API
      filterBy: ['tel'],
      filterOp: 'contains',
      filterValue: telNum
    });*/

    request.onsuccess = (e) => {
      resolve(e.target.result);
    };
    request.onerror = reject;
  });
}

// We will apply createObjectURL for details.photoURL if contact image exist
// Please remember to revoke the photoURL after utilizing it.
export function getContactDetails(number, contacts, include) {
  let details = {};

  include = include || {};

  function updateDetails(contact) {
    let name;
    let phone;
    let i;
    let length;
    let subscriber;
    let org;
    name = contact.name[0];
    org = contact.org && contact.org[0];
    length = contact.tel ? contact.tel.length : 0;
    subscriber = number.length > 7 ? number.substr(-8) : number;

    // Check which of the contacts phone number are we using
    for (i = 0; i < length; i++) {
      // Based on E.164 (http://en.wikipedia.org/wiki/E.164)
      if (contact.tel[i].value.indexOf(subscriber) !== -1) {
        // phone = contact.tel[i];
        break;
      }
    }

    // Add data values for contact activity interaction
    details.isContact = true;

    // Add photo
    if (include.photoURL) {
      let photo = ContactPhotoHelper.getThumbnail(contact);
      if (photo) {
        details.photoURL = window.URL.createObjectURL(photo);
      }
    }

    details.name = name;
    details.phone = phone;
    // We pick the first discovered org name as the phone number's detail
    // org information.
    details.org = details.org || org;
  }

  // In no contact or contact with empty information cases, we will leave
  // the title as the empty string and let caller to decide the title.
  if (!contacts || (Array.isArray(contacts) && 0 === contacts.length)) {
    details.title = '';
  } else if (!Array.isArray(contacts)) {
    updateDetails(contacts);
    details.title = details.name || details.org;
  } else {
    // Rule for fetching details with multiple contact entries:
    // 1) If we got more than 1 contact entry, find another entry if
    //    current entry got no name/company.
    // 2) If we could not get any information from all the entries,
    //    just display phone number.
    for (let i = 0, l = contacts.length; i < l; i++) {
      updateDetails(contacts[i]);
      if (details.name) {
        break;
      }
    }
    details.title = details.name || details.org;
  }

  return details;
}

export function toggleBletooth(targetState) {
  /*if (!navigator.mozBluetooth ||                                   // B2G-API
      !navigator.mozBluetooth.defaultAdapter ||
      !navigator.mozBluetooth.defaultAdapter.state) {
    return Promise.reject('no bluetooth exist');
  }*/

//  let currentState = navigator.mozBluetooth.defaultAdapter.state;  // B2G-API
  let isEnabled = ('enabled' === currentState);
  targetState = targetState || (isEnabled ? 'disable' : 'enable');

  if (currentState.endsWith('ing')) {
    return Promise.reject(`bluetooth state is busy: ${currentState}`);
  }
  //return navigator.mozBluetooth.defaultAdapter[targetState]();  // B2G-API
}
