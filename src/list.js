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
      width: Math.floor(this.screen.width / 2) < 80 ? '50%' : 80,
      height: '100%',
      scrollable: true,
      scrollbar: {
        style: {
          bg: 'green',
        },
      },
      style: {
        selected: {
          bg: 'white',
          fg: 'black',
        },
      },
    });

    this.statusBar = blessed.list({
      parent: this.list,
      bottom: 0,
      left: 0,
      width: '100%',
      height: 1,
      style: {
        bg: 'white',
        fg: 'black',
      },
    });

    this.list.focus();

    this.renderList();
  }

  updateStatusBar() {
    const sortedEvents = this.store.getSortedEvents();
    const selectedEventIndex = this.store.getSelectedEventIndex();

    if (sortedEvents.length > 0) {
      this.statusBar.setContent(
        `${selectedEventIndex + 1} of ${sortedEvents.length} event${sortedEvents.length === 1 ? '' : 's'}`,
      );
    } else {
      this.statusBar.setContent('0 events');
    }
  }

  renderList() {
    const sortedEvents = this.store.getSortedEvents();
    const selectedEventIndex = this.store.getSelectedEventIndex();

    this.list.setItems(sortedEvents);
    this.updateStatusBar();

    if (!this.eventReceived && sortedEvents.length > 0) {
      this.eventReceived = true;
      this.list.select(selectedEventIndex);
    }

    if (this.eventReceived) {
      const selectedEvent = this.store.getSelectedEvent();
      // Keep event selected when a new event is inserted.
      if (selectedEvent) {
        if (this.list.getItemIndex(selectedEvent.name) !== selectedEventIndex) {
          this.list.select(selectedEventIndex);
        }
      }
    }

    return true;
  }

  move(forward) {
    if (this.store.isSelected(Components.list) && this.eventReceived) {
      const selectedEvent = this.store.getSelectedEventIndex();
      const newIndex = _.moveIndex(
        this.store.getSortedEvents(), selectedEvent, forward, false,
      );
      this.store.setSelectedEventIndex(newIndex);
      this.list.select(this.store.getSelectedEventIndex());

      this.updateStatusBar();

      return true;
    }

    return false;
  }
}

module.exports = List;
