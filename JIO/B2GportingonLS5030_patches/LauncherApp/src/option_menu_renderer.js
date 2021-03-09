import React from 'react';
import BaseComponent from 'base-component';
import OptionMenu from 'react-option-menu';
import Service from 'service';

export default class OptionMenuRenderer extends BaseComponent {
  name = 'OptionMenuRenderer';

  constructor(props) {
    super(props);
    this.state = {
      menu: false,
      options: null
    };
    Service.register('showOptionMenu', this);
  }

  showOptionMenu(options) {
    this.lastActive = this.lastActive || document.activeElement;
    this.setState({
      menu: true,
      options: options
    });
  }

  focusLast() {
    if (this.lastActive && this.lastActive.offsetParent) {
      this.lastActive.focus();
    }
    this.lastActive = null;
  }

  componentDidUpdate() {
    if (!this.menu) {
      Service.request('focus');
    } else {
      let self = this;
      this.menu.show(this.state.options);
      this.menu.on('closed', function closeOptionMenu() {
        self.focusLast();
        self.menu.off('closed', closeOptionMenu);
      });
    }
  }

  render() {
    return (
      <div id="menu-root">
        {this.state.menu ? <OptionMenu ref={(node) => { this.menu = node; }} /> : null}
      </div>
    );
  }
}
