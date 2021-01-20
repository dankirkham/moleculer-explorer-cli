const { ServiceBroker } = require('moleculer');

const EVENTS = [
  'foo.bar',
  'foo.fuzz',
  'foo.bar.buzz',
  'foo.bar.boop',
  'bar',
  'bar.foo.fuzz',
];

class EventGenerator {
  constructor(config) {
    const { namespace, transporter } = config;

    this.callbacks = {};

    this.broker = new ServiceBroker({
      namespace,
      transporter,
      nodeID: 'moleculer-explorer-event-generator',
      logger: null,
      logLevel: 'fatal',
    });

    // this.broker.createService({
    //   name: "eventMonitor",
    //   events: {
    //     "**": (ctx) => {
    //       const { eventName, params } = ctx;
    //       this._emit("event", {
    //         name: eventName,
    //         payload: params
    //       });
    //     }
    //   }
    // });
  }

  start() {
    this.broker.start();

    setInterval(() => {
      const name = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      this.broker.emit(name, { hmm: 'okay' });
    }, 100);
  }
}

module.exports = EventGenerator;
