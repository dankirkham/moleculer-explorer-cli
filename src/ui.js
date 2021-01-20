const blessed = require('blessed');

class Ui {
  constructor(store) {
    this.store = store;
    this.callbacks = {};

    this.screen = blessed.screen({ smartCSR: true });

    this.screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
    this.screen.key(['j'], () => this._emit('move', true));
    this.screen.key(['k'], () => this._emit('move', false));
  }

  getScreen() {
    return this.screen;
  }

  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  _emit(event, payload) {
    if (this.callbacks[event]) {
      this.callbacks[event].map((callback) => callback(payload));
    }
  }

  handleNewEvent(ctx) {
    const { name, payload } = ctx;
    this.store.addEvent(name, payload);

    this._emit('eventReceived');
  }
}

module.exports = Ui;
