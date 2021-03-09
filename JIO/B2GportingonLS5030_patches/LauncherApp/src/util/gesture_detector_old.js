/* exported GestureDetector */

import React from 'react';
import BaseComponent from '../base_component';

/**
 * GestureDetector.js: generate events for one and two finger gestures.
 *
 * A GestureDetector object listens for touch events on a specified
 * element and generates higher-level events that describe one and two finger
 * gestures on the element.
 *
 * Supported events:
 *
 *  tap        like a click event
 *  dbltap     like dblclick
 *  pan        one finger motion
 *  swipe      when a finger is released following pan events
 *  holdstart  touch and hold. Must set an option to get these.
 *  holdmove   motion after a holdstart event
 *  holdend    when the finger goes up after holdstart/holdmove
 *  transform  2-finger pinch and twist gestures for scaling and rotation
 *
 * Each of these events is a bubbling CustomEvent with important details in the
 * event.detail field. The event details are not yet stable and are not yet
 * documented. See the calls to emitEvent() for details.
 *
 * To use this library, create a GestureDetector object by passing an element to
 * the GestureDetector() constructor and then calling startDetecting() on it.
 * The element will be the target of all the emitted gesture events. You can
 * also pass an optional object as the second constructor argument. If you're
 * interested in holdstart/holdmove/holdend events, pass {holdEvents:true} as
 * this second argument. Otherwise they will not be generated.
 * If you want to customize the pan threshold, pass {panThreshold:X} 
 * (X and Y in pixels) in the options argument.
 *
 * Implementation note: event processing is done with a simple finite-state
 * machine. This means that in general, the various kinds of gestures are
 * mutually exclusive. You won't get pan events until your finger has
 * moved more than a minimum threshold, for example, but it does, the FSM enters
 * a new state in which it can emit pan and swipe events and cannot emit hold
 * events. Similarly, if you've started a 1 finger pan/swipe gesture and
 * accidentally touch with a second finger, you'll continue to get pan events,
 * and won't suddenly start getting 2-finger transform events.
 *
 * This library never calls preventDefault() or stopPropagation on any of the
 * events it processes, so the raw touch events should still be
 * available for other code to process. It is not clear to me whether this is a
 * feature or a bug.
 */

export default class GestureDetector extends BaseComponent {

  constructor() {
    super();
  }

   //
  // Tuneable parameters
  //
  HOLD_INTERVAL = 1000;     // Hold events after 1000 ms
  PAN_THRESHOLD = 20;       // 20 pixels movement before touch panning
  DOUBLE_TAP_DISTANCE = 50;
  DOUBLE_TAP_TIME = 500;
  VELOCITY_SMOOTHING = 0.5;

  // Don't start sending transform events until the gesture exceeds a threshold
  SCALE_THRESHOLD = 20;     // pixels
  ROTATE_THRESHOLD = 22.5;  // degrees

  // For pans and zooms, we compute new starting coordinates that are part way
  // between the initial event and the event that crossed the threshold so that
  // the first event we send doesn't cause a big lurch. This constant must be
  // between 0 and 1 and says how far along the line between the initial value
  // and the new value we pick
  THRESHOLD_SMOOTHING = 0.9;

  //
  // Helpful shortcuts and utility functions
  //

  abs = Math.abs;
  floor = Math.floor;
  sqrt = Math.sqrt; 
  atan2 = Math.atan2;
  PI = Math.PI;

  // The names of events that we need to register handlers for
  eventtypes = [
    'touchstart',
    'touchmove',
    'touchend'
  ];

  //
  // The following objects are the states of our Finite State Machine
  //

  // In this state we're not processing any gestures, just waiting
  // for an event to start a gesture and ignoring others
  initialState = {
    name: 'initialState',
    init: function(d) {
      // When we enter or return to the initial state, clear
      // the detector properties that were tracking gestures
      // Don't clear d.lastTap here, though. We need it for dbltap events
      d.target = null;
      d.start = d.last = null;
      d.touch1 = d.touch2 = null;
      d.vx = d.vy = null;
      d.startDistance = d.lastDistance = null;
      d.startDirection = d.lastDirection = null;
      d.lastMidpoint = null;
      d.scaled = d.rotated = null;
    },

    // Switch to the touchstarted state and process the touch event there
    touchstart: function(d, e, t) {
      d.switchTo(touchStartedState, e, t);
    }
  };


  startDetecting(e, options) {
    var self = this;
    this.element = e;
    this.options = options || {};
    this.options.panThreshold = this.options.panThreshold || PAN_THRESHOLD;
    this.state = initialState;
    this.timers = {};
    eventtypes.forEach(function(t) {
      self.element.addEventListener(t, self.handleEvent);
    });
  }

  stopDetecting() {
    var self = this;
    eventtypes.forEach(function(t) {
      self.element.removeEventListener(t, self.handleEvent);
    });
  }

  startTimer (type, time) {
    this.clearTimer(type);
    var self = this;
    this.timers[type] = setTimeout(function() {
      self.timers[type] = null;
      var handler = self.state[type];
      if (handler) {
        handler(self, type);
      }
    }, time);
  }

  clearTimer(type) {
    if (this.timers[type]) {
      clearTimeout(this.timers[type]);
      this.timers[type] = null;
    }
  }

  // Switch to a new FSM state, and call the init() function of that
  // state, if it has one.  The event and touch arguments are optional
  // and are just passed through to the state init function.
  switchTo(state, event, touch) {
    this.state = state;
    if (state.init) {
      state.init(this, event, touch);
    }
  };

  emitEvent (type, detail) {
    if (!this.target) {
      console.error('Attempt to emit event with no target');
      return;
    }

    var event = this.element.ownerDocument.createEvent('CustomEvent');
    event.initCustomEvent(type, true, true, detail);
    this.target.dispatchEvent(event);
  };

  handleEvent(e) {
    console.log('Touch Event Received :: ' + JSON.stringify(e));
  }

}
