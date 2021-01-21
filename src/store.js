const Components = require('./components');
const _ = require('./utils');

class Store {
  constructor() {
    this.events = [];
    this.sortedEvents = [];
    this.selectedComponent = 'list';
    this.selectedEventIndex = 0;
  }

  getEvent(name) {
    return this.events[name];
  }

  getSortedEvents() {
    return this.sortedEvents;
  }

  addEvent(eventName, payload) {
    this.events[eventName] = JSON.stringify(payload, null, 2);

    let selectedEventName;
    if (this.sortedEvents.length >= 1) {
      selectedEventName = this.getSelectedEvent().name;
    } else {
      selectedEventName = eventName;
    }
    const events = Object.keys(this.events);
    const roots = events.map((name) => name.split('.').reduce((acc, val) => {
      if (acc.length === 0) {
        acc.push(val);
      } else {
        acc.push(`${acc[acc.length - 1]}.${val}`);
      }
      return acc;
    }, []));
    this.sortedEvents = _.unique(events.concat(_.flatten(roots)).sort());

    this.selectedEventIndex = this.sortedEvents.findIndex(
      (name) => name === selectedEventName,
    );
  }

  isSelected(component) {
    return this.selectedComponent === component;
  }

  selectComponent(forward) {
    const componentList = Object.keys(Components);
    const index = componentList.indexOf(this.selectedComponent);
    _.moveIndex(componentList, index, forward);

    this.selectedComponent = componentList[index];
  }

  getSelectedEventIndex() {
    return this.selectedEventIndex;
  }

  setSelectedEventIndex(index) {
    this.selectedEventIndex = index;
  }

  getSelectedEvent() {
    const name = this.sortedEvents[this.selectedEventIndex];
    const payload = this.events[name];

    return {
      name,
      payload,
    };
  }
}

module.exports = Store;
