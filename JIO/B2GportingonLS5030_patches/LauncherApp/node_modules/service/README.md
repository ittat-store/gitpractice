# servicejs
In the world of asynchronous loading we will find we need to ask other modules to do something for us even before it is loaded.
servicejs is created as a request queuing system across your modules.
A module could request at any timing without check if other module is loaded or active.

Note: You need to have your own loader; servicejs does not load the requestee for you.
As the designer of your website, you have the responsibility to design the loading sequence.

## Usage ##
### Sample 1 ###
```js
  var A = {
    name: 'A',
    show: function() {
      Service.request('B:hide');
    }
  };
  Service.register('show', A);
  A.show(); // B.hide() will be executed once it registers.
  var B = {
    name: 'B',
    hide: function() {}
  };
  Service.register('hide', B);
```

### Sample 2 ###
```js
  var Person = function(name) {
    this.name = name;
  };
  Person.prototype = {
    helpHelpHelp: function() {
      this._emergent = true;
      Service.request('save', this);
    },
    inEmergency: function() {
      return this._emergent;
    }
  };
  var John = new Person('John');
  John.helpHelpHelp(); // The request is now queued.
  var SuperHero = function(name) {
    this.name = name;
  };
  SuperHero.prototype = {
    name: 'Superhero',
    save: function(target) {
      if (target.inEmergency()) {
        this.flyTo(target);
      }
    },
    flyTo: function(target) {
      console.yield('flying');
    },
    transform: function() {
      Service.register('save', Superman); // Superhero will serve 'save' from now on.
    },
    untransform: function() {
      Service.unregister('save', Superman); // Superhero now is off duty.
    }
  };
  var Superman = new SuperHero('Superman');
  var Supergirl = new SuperHero('Supergirl');

  Superman.transform(); // John will be rescued by Superman!
  var Mary = new Person('Mary');
  Supergirl.transform();
  Mary.helpHelpHelp(); // Both Superman and Supergirl will proceed this request.
```

### Sample 3 ###
```js
  var PermissionServer = function() {};
  PermissionServer.prototype = {
    camera: null,
    name: 'PermissionServer',
    permission: function(name) {
      return new Promise(function(resolve) {
        resolve(this.camera);
      }.bind(this));
    }
  };
  Service.request('permission', 'camera').then(function() {
    // Do something
  });
```