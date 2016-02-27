'use strict';

// INFO: service-gear specific modules
const Service = require('../utils/Service');

// INFO: common modules
const _ = require('lodash');

class Listeners {
  static message(data, context) {
    console.log('Listeners.message:', 'data:', data, 'context:', context);
    if (data.subtype) {
      Service.interpret(data.message, this);
    } else {
      Service.interpret(data, this);
    }

  }

  /**
   * Function to return static functions of this class
   *
   * @retuns {Array} methods List of static functions in this class
   */
  static getMethods() {

    // INFO: get all properties of this class (object)
    let methods = Object.getOwnPropertyNames(this);

    // INFO: filter out ones we don't want
    methods = _.filter(methods, (prop) => {
      return prop !== 'name'
        && prop !== 'length'
        && prop !== 'prototype'
        && prop !== 'getMethods';
    });
    return methods;
  }
}

module.exports = Listeners;