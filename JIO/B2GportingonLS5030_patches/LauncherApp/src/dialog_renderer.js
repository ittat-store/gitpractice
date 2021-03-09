import React from 'react';
import BaseComponent from 'base-component';
import Service from 'service';
import ReactDialog from 'react-dialog';
import '../style/scss/dialog_renderer.scss';

export default class DialogRenderer extends BaseComponent {
  name = 'DialogRenderer';

  constructor(props) {
    super(props);
    this.state = {
      dialog: false,
      options: {}
    };
    Service.register('showDialog', this);
    Service.register('hideDialog', this);
    Service.registerState('isHidden', this);
    this.isHidden = true;
  }

  showDialog(options) {
    this.lastActive = this.lastActive || document.activeElement;
    this.setState({
      dialog: true,
      options: options
    });
    this.isHidden = false;
  }

  hideDialog() {
    this.dialog.hide();
  }

  focusLast() {
    if (this.lastActive && this.lastActive.offsetParent) {
      this.lastActive.focus();
    }
    this.lastActive = null;
  }

  componentDidUpdate() {
    let self = this;
    this.dialog.show();
    this.dialog.on('closed', function closeDialog() {
      self.isHidden = true;
      self.focusLast();
      self.dialog.off('closed', closeDialog);
    });
  }

  render() {
    return (
      <div
        id="dialog-root"
        className={`dialog-root ${this.state.options.otherClass || ''}`}
      >
        {
          this.state.dialog
          ? <ReactDialog ref={(node) => { this.dialog = node; }} {...this.state.options} />
          : null
        }
      </div>
    );
  }
}
