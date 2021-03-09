function ManifestHelper_get(prop) {
  var manifest = this;
  var value = manifest[prop];

  //var lang = navigator.mozL10n.language.code || '';  // B2G-API
  let defaultLang = manifest.default_locale || '';

  /*if (lang in navigator.mozL10n.qps &&   // B2G-API
      ('name' === prop || 'description' === prop || 'short_name' === prop)) {
    value = navigator.mozL10n.qps[navigator.language].translate(value);
  } else if (manifest.locales) {
    // try to replace values from the locales object using the best language
    // match.  stop when a replacement is found
    [
      lang,
      lang.substr(0, lang.indexOf('-')),
      defaultLang,
      defaultLang.substr(0, lang.indexOf('-'))
    ].some(function tryLanguage(_lang) {
      // this === manifest.locales
      if (this[_lang] && this[_lang][prop]) {
        value = this[_lang][prop];
        // aborts [].some
        return true;
      }
      return false;
    }, manifest.locales);
  }*/

  // return a new ManifestHelper for any object children
  if ('object' === typeof value && !(value instanceof Array)) {
    value = new ManifestHelper(value);
  }
  return value;
}

/**
 * Helper object to access manifest information with locale support.
 *
 * @constructor
 * @param {Object} manifest The app manifest.
 */
function ManifestHelper(manifest) {
  // Bind getters for the localized property values.
  for (let prop in manifest) {
    Object.defineProperty(this, prop, {
      get: ManifestHelper_get.bind(manifest, prop),
      enumerable: true
    });
  }
}

/**
 * Getter for display name (short_name if defined, otherwise name).
 */
Object.defineProperty(ManifestHelper.prototype, 'displayName', {
  get: function displayName() {
    return this.short_name || this.name;
  }
});

export default ManifestHelper;
