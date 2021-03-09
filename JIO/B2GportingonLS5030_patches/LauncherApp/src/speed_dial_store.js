import BaseComponent from 'base-component';
import ContactStore from 'contact_store';
import SettingsManager from 'settings-manager';

class SpeedDialStore extends BaseComponent {
  SIZE = 9;
  contacts = [];

  start() {
    this.fetch();

    this.getCustomSpeedDials();
    //navigator.mozContacts.addEventListener('speeddialchange', this.fetch.bind(this));  // B2G-API
    //navigator.mozContacts.addEventListener('contactchange', this.fetch.bind(this));    // B2G-API
  }

  getCustomSpeedDials() {
    SettingsManager.get('custom.speeddials').then((customSpeedDials) => {
      if (!customSpeedDials) {
        return;
      }
      this.customSpeedDials = customSpeedDials;
      this.fillCustomSpeedDials(customSpeedDials);
      this.emit('changed');
    });
  }

  fillCustomSpeedDials(customSpeedDials = []) {
    customSpeedDials.forEach((customSpeedDial) => {
      let key = parseInt(customSpeedDial.key, 10);
      this.contacts[key - 1] = {
        dial: key,
        editable: false,
        tel: customSpeedDial.tel,
        name: customSpeedDial.name,
        id: 'customsd'
      };
    });
  }

  fetch() {
    this.initData();
    this.fillCustomSpeedDials(this.customSpeedDials);
    /*navigator.mozContacts.getSpeedDials().then((result) => {   // B2G-API
      this.parse(result);
    });*/
  }

  set(number, tel, id) {
    //let req = navigator.mozContacts.setSpeedDial(number, tel, id);  // B2G-API
    req.onerror = (err) => {
      console.warn('Failed to set speed dial', err);
    };
  }

  remove(number) {
    //let req = navigator.mozContacts.removeSpeedDial(number); // B2G-API
    req.onerror = (err) => {
      console.warn('Failed to remove speed dial', err);
    };
  }

  initData() {
    this.contacts = Array(this.SIZE).fill(null).map((item, index) => {
      return {
        dial: index + 1,
        editable: true
      };
    });
  }

  parse(configs) {
    let promises = configs.map((config) => {
      return new Promise((resolve) => {
        ContactStore.findById(config.contactId, (contact) => {
          if (!(contact instanceof window.mozContact)) {
            console.warn(`Con not find this contact by id: ${config.contactId}.`);
            resolve();
            return;
          }

          let photo;
          if (contact.photo && contact.photo.length) {
            photo = window.URL.createObjectURL(contact.photo[0]);
          }

          let dial = parseInt(config.speedDial, 10);
          Object.assign(this.contacts[dial - 1], {
            id: config.contactId,
            name: contact.name && contact.name[0],
            photo,
            dial: dial,
            tel: config.tel
          });
          resolve();
        });
      });
    }, this);

    Promise.all(promises).then(() => {
      this.emit('changed');
    });
  }
}

const speedDialStore = new SpeedDialStore();
speedDialStore.start();

export default speedDialStore;
