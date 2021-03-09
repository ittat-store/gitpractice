import React from 'react';
import ReactDOM from 'react-dom';
import Service from 'service';
import '../style/scss/index.scss';

function ensureValidEventName(eventName) {
  if (!eventName || typeof eventName !== 'string') {
    throw new Error('Event name should be a valid non-empty string!');
  }
}

function ensureValidHandler(handler) {
  if (typeof handler !== 'function') {
    throw new Error('Handler should be a function!');
  }
}

export default class BaseComponent extends React.Component {
  setHierarchy(active) {
    if (!this.getElement()) {
      return;
    }
    if (active) {
      this.getElement().focus();
    }
  }

  handleEvent(evt) {
    if (typeof(this._pre_handleEvent) == 'function') {
      var shouldContinue = this._pre_handleEvent(evt);
      if (shouldContinue === false) {
        return;
      }
    } else {
      this.debug('no handle event pre found. skip');
    }
    if (typeof(this['_handle_' + evt.type]) == 'function') {
      this.debug('handling ' + evt.type);
      this['_handle_' + evt.type](evt);
    }
    if (typeof(this._post_handleEvent) == 'function') {
      this._post_handleEvent(evt);
    }
  }

  open(animation) {
    // Use ReactAnimationComposer
  }

  close(animation) {
    // Use ReactAnimationComposer
  }

  show() {
    if (!this.getElement()) {
      return;
    }
    this.getElement().classList.remove('hidden');
    this.focus();
    this.emit('opened');
  }

  hide() {
    if (!this.getElement()) {
      return;
    }
    this.getElement().classList.add('hidden');
    this.emit('closed');
  }

  focus() {
    if (!this.getElement()) {
      return;
    }
    this.getElement().focus();
  }

  respondToHierarchyEvent(e) {
    if (this.isActive()) {
      return false;
    }
    return true;
  }

  _changeState(type, state) {
    if (!this.getElement()) {
      return;
    }
    this.getElement().setAttribute(type + '-state', state.toString());
  }

  isHidden() {
    if (!this.getElement()) {
      return true;
    }
    return this.getElement().classList.contains('hidden');
  }

  isActive() {
    if (!this.getElement()) {
      return false;
    }
    return !this.getElement().classList.contains('hidden');
  }

  publish(event, detail, noPrefix) {
    if (!this.getElement()) {
      return;
    }
    // Dispatch internal event before external events.
    this.broadcast(event, detail);
    var evt = new CustomEvent(noPrefix ? event : this.EVENT_PREFIX + event,
                {
                  bubbles: true,
                  detail: detail || this
                });

    this.debug('publishing external event: ' + event +
      (detail ? JSON.stringify(detail) : ''));

    this.getElement().dispatchEvent(evt);
  }

  getElement() {
    return this.element || ReactDOM.findDOMNode(this);
  }

  broadcast(event, detail) {
    if (!this.getElement()) {
      return;
    }
    // Broadcast internal event.
    var internalEvent =
      new CustomEvent('_' + event,
        {
          bubbles: false,
          detail: detail || this
        });

    this.getElement().dispatchEvent(internalEvent);
  }

  debug() {
    if (this.DEBUG) {
      console.log('[' + this.name + ']' +
        '[' + Service.currentTime() + '] ' +
          Array.prototype.slice.call(arguments).concat());
      if (this.TRACE) {
        console.trace();
      }
    }
  }

  /**
   * Registers listener function to be executed once event occurs.
   * @param {string} eventName Name of the event to listen for.
   * @param {function} handler Handler to be executed once event occurs.
   */
  on(eventName, handler) {
    ensureValidEventName(eventName);
    ensureValidHandler(handler);
    if (!this.listeners) {
      this.listeners = new Map();
    }

    var handlers = this.listeners.get(eventName);

    if (!handlers) {
      handlers = new Set();
      this.listeners.set(eventName, handlers);
    }

    // Set.add ignores handler if it has been already registered
    handlers.add(handler);
  }

  /**
   * Removes registered listener for the specified event.
   * @param {string} eventName Name of the event to remove listener for.
   * @param {function} handler Handler to remove, so it won't be executed
   * next time event occurs.
   */
  off(eventName, handler) {
    ensureValidEventName(eventName);
    ensureValidHandler(handler);

    var handlers = this.listeners.get(eventName);

    if (!handlers) {
      return;
    }

    handlers.delete(handler);

    if (!handlers.size) {
      this.listeners.delete(eventName);
    }
  }

  /**
   * Removes all registered listeners for the specified event.
   * @param {string} eventName Name of the event to remove all listeners for.
   */
  offAll(eventName) {
    if (typeof eventName === 'undefined') {
      this.listeners.clear();
      return;
    }

    ensureValidEventName(eventName);

    var handlers = this.listeners.get(eventName);

    if (!handlers) {
      return;
    }

    handlers.clear();

    this.listeners.delete(eventName);
  }

  observe(name, value) {
    if (!this._settings) {
      this._settings = {};
    }
    this._settings[name] = value;
    if (typeof(this['_observe_' + name]) === 'function') {
      this['_observe_' + name](value);
    }
  }

  /**
   * Emits specified event so that all registered handlers will be called
   * with the specified parameters.
   * @param {string} eventName Name of the event to call handlers for.
   * @param {Object} parameters Optional parameters that will be passed to
   * every registered handler.
   */
  emit(eventName, ...parameters) {
    ensureValidEventName(eventName);
    if (!this.listeners) {
      this.listeners = new Map();
    }

    var handlers = this.listeners.get(eventName);

    if (!handlers) {
      return;
    }

    handlers.forEach(function(handler) {
      try {
        handler.apply(null, parameters);
      } catch (e) {
        console.error(e);
      }
    });
  }
}
