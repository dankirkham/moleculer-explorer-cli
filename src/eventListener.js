const { ServiceBroker } = require('moleculer');

class EventListener {
  constructor(config) {
    const { namespace, transporter } = config;

    this.callbacks = {};

    this.broker = new ServiceBroker({
      namespace,
      transporter,
      nodeID: 'moleculer-explorer-cli',
      logger: null,
      logLevel: 'fatal',
    });

    this.broker.createService({
      name: 'eventMonitor',
      events: {
        '**': (ctx) => {
          const { eventName, params } = ctx;
          this._emit('event', {
            name: eventName,
            payload: params,
          });
        },
      },
    });
  }

  _emit(event, payload) {
    if (this.callbacks[event]) {
      this.callbacks[event].map((callback) => callback(payload));
    }
  }

  on(event, callback) {
    if (!this.callbacks.event) {
      this.callbacks[event] = [];
    }

    this.callbacks.event.push(callback);
  }

  start() {
    this.broker.start();
  }
}

module.exports = EventListener;
