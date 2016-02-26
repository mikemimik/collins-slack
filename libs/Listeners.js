'use strict';

const Service = require('../utils/Service');

class Listeners {
  static message(context, data) {
    Service.interpret.bind(context, data);
  }
}

module.exports = Listeners;