const blessed = require('blessed');

class Event {
  constructor(screen, store) {
    this.screen = screen;
    this.store = store;

    this.box = blessed.box({
      parent: this.screen,
      top: 0,
      left: Math.floor(this.screen.width / 2) < 80 ? '50%' : 80,
      width: '100%',
      height: '100%',
      border: 'line',
    });

    this.update();
  }

  update() {
    const data = this.store.getSelectedEvent();
    if (!data) return;

    const { name, payload } = data;
    this.box.setContent(payload || '<No payload>');
    this.box.setLabel(name || '');
  }
}

module.exports = Event;
