# Usage #
```js
import SoftKey from 'react-soft-key';
import SoftKeyStore from 'soft-key-store';
import 'react-soft-key/assets/index.scss';

class App extends React.Component {
  render() {
    componentDidUpdate() {
      SoftKeyStore.register({
        'left': 'cancel',
        'right': 'ok'
      }, ReactDOM.findDOMNode(this))
    }
    return (
      <div>
        <SoftKey />
      </div>
    );
  }
}
```

## Parameter Type:

1. String type:

    ```js
    {
      left: 'back',
      center: 'icon=ok'
    }
    ```

2. Object type

    ```
    {
      left: {
        text: 'cancel'
      },
      center: {
        text: 'call',
        icon: 'sim-1'
      }
    }
    ```