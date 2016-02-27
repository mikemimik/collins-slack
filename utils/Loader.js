'use strict';

// INFO: service-gear specific modules
const Listeners = require('../libs/Listeners');

// INFO: common modules
const _ = require('lodash');
const async = require('async');

// INFO: npm-service-module
const Slack = require('slack-client');

class Loader {
  static initConfig(next) {
    this.logger.gear('CollinsSlack', 'Loader', 'initConfig', 'this:', this); // TESTING

    // TODO: convert `debug: true` into `debug: 'debug'`
    // TODO: convert `debug: false` into `debug: 'info'`??
    let processedConfig = this.config;
    // let {
    //   token, /* required */
    //   socketFn, /* optional */
    //   dataStore, /* optional */
    //   autoReconnect, /* optional */
    //   maxReconnectionAttempts, /* optional */
    //   reconnectionBackoff, /* optional */
    //   wsPingInterval, /* optional */
    //   maxPongInterval, /* optional */
    //   logLevel, /* optional (Default: 'info') */
    //   logger /* optional, probably don't use this */
    // } = this.config;
    // if (token === null || token === undefined) { /* emit error */ }
    // if (socketFn === null || socketFn === undefined) { /* emit error */ }
    // if (dataStore === null || dataStore === undefined) { /* emit error */ }
    // if (autoReconnect === null || autoReconnect === undefined) { /* emit error */ }
    // if (maxReconnectionAttempts === null || maxReconnectionAttempts === undefined) {
    //   /* emit error */
    // }
    // if (reconnectionBackoff === null || reconnectionBackoff === undefined) { /* emit error */ }
    // if (wsPingInterval === null || wsPingInterval === undefined) { /* emit error */ }
    // if (maxPongInterval === null || maxPongInterval === undefined) { /* emit error */ }
    // if (logLevel === null || logLevel === undefined) { /* emit error */ }
    // if (logger === null || logger === undefined) { /* emit error */ }
    this.config = processedConfig;
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
        console.log('async.each failed while client.on() was called');
      }
    });
    next(null);
  }
}

module.exports = Loader;