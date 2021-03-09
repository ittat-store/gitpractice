import BaseModule from 'base-module';

class FlashlightHelper extends BaseModule {
  name = 'FlashlightHelper';

  constructor(props) {
    super(props);
    //navigator.getFlashlightManager().then(this.init.bind(this)); // B2G-API
  }

  init(flashlightManager) {
    flashlightManager.addEventListener('flashlightchange', this);
    this.flashlightManager = flashlightManager;
    this.emit('ready', flashlightManager.flashlightEnabled);
  }

  _handle_flashlightchange() {
    this.emit('change', this.flashlightManager.flashlightEnabled);
  }

  toggle() {
    this.flashlightManager.flashlightEnabled = !this.flashlightManager.flashlightEnabled;
  }
}

export default (new FlashlightHelper());
