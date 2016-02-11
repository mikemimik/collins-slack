'use strict';

class Listeners {
  static onMessage(message) {
    console.log('>>', 'CollinsSlack', 'msg', message);
  }
}

module.exports = Listeners;