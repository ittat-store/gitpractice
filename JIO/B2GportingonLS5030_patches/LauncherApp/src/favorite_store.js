import BaseEmitter from 'base-emitter';

class FavoriteStore extends BaseEmitter {
  favorites = [];
  jioDevPatterns = /https:\/\/api\.dev\.jiophone\.net\//gi;
  getFotaManifestURL(manifestURL) {
    return manifestURL.replace(this.jioDevPatterns, 'https://api.kai.jiophone.net/');
  }
  toggle(manifestURL, entry) {
    let found = -1;
    let existed = this.favorites.some((raw, index) => {
      let matched = (raw.manifestURL === manifestURL && raw.entry === entry);
      if (matched) {
        found = index;
      }
      return matched;
    });

    if (existed) {
      // remove
      this.favorites.splice(found, 1);
      this.save();
    } else {
      // add
      this.favorites.push({ manifestURL, entry });
      this.save();
    }
  }
  save() {
    window.localStorage.setItem('favorites', JSON.stringify(this.favorites));
    this.emit('change');
  }
  start() {
    if (this.started) {
      return;
    }
    this.started = true;
    let favorites = window.localStorage.getItem('favorites');
    if (favorites) {
      favorites = JSON.parse(favorites);
    } else {
      favorites = [];
    }
    this.favorites = favorites;
    this.emit('change');
    return this;
  }
}

export default (new FavoriteStore());
