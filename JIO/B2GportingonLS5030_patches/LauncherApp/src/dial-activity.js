import React from 'react';
import ReactDOM from 'react-dom';
import ReactSoftKey from 'react-soft-key';
import Service from 'service';
import ReactSimChooser from 'react-sim-chooser';
import OptionMenuRenderer from 'option_menu_renderer';
import DialogRenderer from 'dialog_renderer';
import dialHelper from 'util/dial_helper';
import * as utils from 'util/utils';
import '../style/scss/definitions.scss';
import '../style/scss/app.scss';

class DialActivity extends React.Component {
  constructor(props) {
    super(props);
    //navigator.mozSetMessageHandler('activity', this.activityHandler.bind(this)); // B2G-API
  }

  name = 'DialActivity';

  activityHandler(activityRequest) {
    let option = activityRequest.source;
   /* navigator.mozL10n.ready(() => {   // B2G-API
      let number = option.data && option.data.number;

      if (!number) {
        window.alert(utils.toL10n('invalidNumberToDialMessage'));
        window.close();
        return;
      }

      Service.request('showDialog', {
        ok: 'call',
        cancel: 'cancel',
        type: 'confirm',
        header: null,
        content: number,
        translated: true,
        onOk: () => {
          Service.request('chooseSim', 'call').then((cardIndex) => {
            dialHelper.dialForcely(number, cardIndex);
            window.close();
          }).catch(() => {
            window.close();
          });
        },
        onCancel: () => {
          window.close();
        },
        onBack: () => {
          window.close();
        }
      });
    });*/
  }

  render() {
    return (
      <div className="app-workspace">
        <OptionMenuRenderer />
        <ReactSimChooser />
        <DialogRenderer />
        <ReactSoftKey />
      </div>
    );
  }
}

ReactDOM.render(<DialActivity />, document.getElementById('root'));
