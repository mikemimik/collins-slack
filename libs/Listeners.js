'use strict';

class Listeners {
  static onMessage(message) {
    console.log('>>', 'CollinsSlack', 'msg', message);
  }

  static onConnecting() {
    let args = Array.prototype.splice.apply(arguments);
    console.log('>>', 'CollinsSlack', 'onConnecting', args);
  }
}

module.exports = Listeners;