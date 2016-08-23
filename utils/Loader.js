'use strict';

// INFO: service-gear specific modules
const Listeners = require('../libs/Listeners');
const SlackError = require('collins-error');

// INFO: common modules
const _ = require('lodash');
const async = require('async');

// INFO: npm-service-module
const Slack = require('@slack/client');

class Loader {

  /**
   * @static
   * @desc Function which loads the passed in configuration object from
   *       `collins-core`. It then validates that config object against the
   *       module's `schema`.
   * @summary gear config validation
   * @param {Object} config The `service-gear` instance corresponding to this
   *                        service, passed in from`collins-core`.
   *
   * @param {Function} next Callback function.
   */
  static initConfig (config, next) {
    this.logger.gear(this.constructor.name, 'Loader#initConfig');
    this.configuration.configObj.load(config.config);
    try {
      this.configuration.configObj.validate();
    } catch (e) {
      let validationError = SlackError.convert('Invalid:Config', e);
      next(validationError);
    }
    this.logger.gear(this.constructor.name, 'Loader#initConfig', 'complete');
    next(null);
  }

  static initGear(next) {
    const Client = Slack.RtmClient;
    const DataStore = Slack.MemoryDataStore;

    // INFO: making assumption config file has been processed
    this.Runtime['dataStore'] = new DataStore({ logger: this.logger });
    this.Runtime['client'] = new Client(this.config.token, {
      logger: this.logger,
      dataStore: this.Runtime['dataStore']
    });
    next(null);
  }

  static initCogs(next) {
    // console.log(this.constructor.name, 'initCogs', this.config.cogs); // TESTING
    this.Runtime['cogs'] = [];
    let cogList = _.keys(this.config.cogs);
    async.each(cogList, (cog, each_cb) => {
      this.Runtime.cogs.push(this.config.cogs[cog]);

      each_cb(null);
    }, (err) => {
      // INFO: all cog triggers have been added to the Listener class
      // console.log('finished async.each'); // TESTING
    });

    // console.log('runtime:', this.Runtime.cogs); // TESTING
    next(null);
  }

  static initListeners(next) {
    let listeners = Listeners.getMethods();
    async.each(listeners, (listener, each_cb) => {
      let check = this.Runtime['client'].on(listener, _.bind(Listeners[listener], this, _));
      if (check === this.Runtime['client']) {
        each_cb(null);
      } else {
        each_cb(true);
      }
    }, (err) => {
      if (err) {
        console.log('async.each failed while client.on() was called'); // TESTING
      }
      next(err);
    });
  }
}

module.exports = Loader;