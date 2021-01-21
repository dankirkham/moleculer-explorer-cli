const Ui = require('./ui');
const Store = require('./store');
const List = require('./list');
const Event = require('./event');
const EventListener = require('./eventListener');
const EventGenerator = require('./eventGenerator');

// Setup UI
const store = new Store();
const ui = new Ui(store);
const list = new List(ui.getScreen(), store);
const event = new Event(ui.getScreen(), store);

ui.on('eventReceived', () => list.renderList());

ui.on('move', (forward) => {
  const shouldRender = list.move(forward);
  event.update();

  return shouldRender;
});

ui.start();

// Setup Moleculer
const eventListener = new EventListener({
  namespace: 'myNamespace',
  transporter: 'mqtt',
});
eventListener.on('event', (payload) => ui.handleNewEvent(payload));
eventListener.start();

const eventGenerator = new EventGenerator({
  namespace: 'myNamespace',
  transporter: 'mqtt',
});
eventGenerator.start();
