const EventEmitter = require('events');

const eventBus = new EventEmitter();
eventBus.setMaxListeners(20);

module.exports = { eventBus };
