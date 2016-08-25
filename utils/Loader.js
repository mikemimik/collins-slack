'use strict';

// INFO: service-gear specific modules
const Listeners = require('../libs/Listeners');
const SlackError = require('collins-error');

// INFO: common modules
const Async = require('async');
const _ = require('lodash');

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
    this.logger.debug(this.constructor.name, 'Loader#initConfig', { from: 'gear' });
    this.configuration.configObj.load(config);
    let validationError = null;
    try {
      this.configuration.configObj.validate();
    } catch (e) {
      validationError = SlackError.convert('Invalid:Config', e);
    }
    this.logger.debug(this.constructor.name, 'Loader#initConfig', 'complete', { from: 'gear' });
    next(validationError);
  }

  /**
   * @static
   * @desc Initializes this gear to be ready to connect to it's service.
   *       Creates a `DataStore` object which slack uses to store information
   *       while connected to a slack team. Then creates a `Client` object
   *       will connects utilizing the token passed to it from the
   *       initialization of `collins-core`, `this.logger`, and a `dataStore`
   *       object, just created.
   * @summary gear initialization: specific to npm-service-module
   * @param {Function} next Callback function.
   */
  static initGear (next) {
    this.logger.debug(this.constructor.name, 'Loader#initGear', { from: 'gear' });
    let validationError = null;
    const Client = Slack.RtmClient;
    const DataStore = Slack.MemoryDataStore;
    try {
      // this.Runtime['dataStore'] = new DataStore({ logger: this.logger });
      this.Runtime['dataStore'] = new DataStore();
      this.Runtime['client'] = new Client(
        this.configuration.configObj.get('token'),
        { logger: this.logger.log.bind(this.logger), dataStore: this.Runtime['dataStore'] }
      );
    } catch (e) {
      validationError = SlackError.convert('Invalid:Config', e);
    }
    this.logger.debug(this.constructor.name, 'Loader#initGear', 'complete', { from: 'gear' });
    next(validationError);
  }

  static initCogs (next) {
    this.Runtime['cogs'] = [];
    let cogList = _.keys(this.config.cogs);
    Async.each(cogList, (cog, doneCog) => {
      this.Runtime.cogs.push(this.config.cogs[cog]);

      doneCog(null);
    }, (err) => {
      // TODO: catch error
      if (err) {

      }
      // INFO: all cog triggers have been added to the Listener class
      this.logger.debug(this.constructor.name, 'Loader#initCogs', 'complete', { from: 'gear' });
      next(null);
    });
  }

  static initListeners(next) {
    this.logger.debug(this.constructor.name, 'Loader#initListeners', { from: 'gear' });
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
        this.logger.error(this.constructor.name, 'Loader#initListeners', err);
      }
      this.logger.debug(this.constructor.name, 'Loader#initListeners', 'complete', { from: 'gear' });
      next(err);
    });
  }
}

module.exports = Loader;