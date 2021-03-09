import BaseEmitter from 'base-emitter';
import * as utils from 'util/utils.js';

class GridHelper extends BaseEmitter {
  name = 'GridHelper';

  constructor(props) {
    super(props);
    if (utils.isLandscape) {
      this.grid = {
        row: 2,
        col: 4
      };
    } else {
      this.grid = {
        row: 5,
        col: 4
      };
    }

    this.emit('change', this.grid);
  }
}

export default (new GridHelper());
