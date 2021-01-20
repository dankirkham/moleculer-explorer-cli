const blessed = require('blessed');
const _ = require('./utils');
const Components = require('./components');

class List {
  constructor(screen, store) {
    this.screen = screen;
    this.store = store;

    // true when we have received at least one event.
    this.eventReceived = false;

    this.list = blessed.list({
      parent: this.screen,
      top: 0,
      left: 0,
      width: 80,
      height: '100%',
      scrollable: true,
      scrollbar: {
        style: {
          bg: 'green',
        },
      },
      style: {
        selected: {
          bg: 'green',
          fg: 'white',
        },
      },
    });

    this.list.focus();

    this.renderList();
  }

  renderList() {
    this.list.setItems(this.store.getSortedEvents());

    if (!this.eventReceived) {
      this.eventReceived = true;
      this.store.setSelectedEventIndex(0);
      this.list.select(this.store.getSelectedEventIndex());
    }

    const selectedEvent = this.store.getSelectedEvent();
    const selectedEventIndex = this.store.getSelectedEventIndex();
    if (selectedEvent) {
      if (this.list.getItemIndex(selectedEvent.name) !== selectedEventIndex) {
        this.list.select(selectedEventIndex);
      }
    }

    this.screen.render();
  }

  move(forward) {
    if (this.store.isSelected(Components.list) && this.eventReceived) {
      const selectedEvent = this.store.getSelectedEventIndex();
      this.store.setSelectedEventIndex(
        _.moveIndex(this.store.getSortedEvents(), selectedEvent, forward, false),
      );
      this.list.select(this.store.getSelectedEventIndex());
      this.screen.render();
    }
  }
}

module.exports = List;
