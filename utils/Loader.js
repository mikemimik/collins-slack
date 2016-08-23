'use strict';

// INFO: service-gear specific modules
const Listeners = require('../libs/Listeners');
const SlackError = require('collins-error');

// INFO: common modules
const _ = require('lodash');
const async = require('async');

// INFO: npm-service-module
const Slack = require('slack-client');

class Loader {
  static initConfig(next) {
    this.logger.gear('CollinsSlack', 'Loader', 'initConfig', 'this:', this); // TESTING

    let processedConfig = this.config;
    let {
      token, /* required */
      commandChar, /* required */
      dataStore, /* required; should be */
      logger, /* required; should be */
      userAgent,
      debug,
      // autoReconnect, /* optional - npm service module option */
      // maxReconnectionAttempts, /* optional - npm service module option */
      // reconnectionBackoff, /* optional - npm service module option */
      // wsPingInterval, /* optional - npm service module option */
      // maxPongInterval, /* optional - npm service module option */
      // socketFn, /* optional - npm service module option */
      // logLevel, /* optional (Default: 'info') */
    } = this.config;
    if (token === null || token === undefined) { /* emit error */ }
    if (dataStore === null || dataStore === undefined) { /* emit error */ }
    if (commandChar === null || commandChar === undefined) { /* emit error */ }
    if (logger === null || logger === undefined) { /* emit error */ }
    if (userAgent === null || userAgent === undefined) { /* emit error */ }
    if (debug === null || debug === undefined) { /* emit error */ }
    // if (socketFn === null || socketFn === undefined) { /* emit error */ }
    // if (autoReconnect === null || autoReconnect === undefined) { /* emit error */ }
    // if (maxReconnectionAttempts === null || maxReconnectionAttempts === undefined) {
    //   /* emit error */
    // }
    // if (reconnectionBackoff === null || reconnectionBackoff === undefined) { /* emit error */ }
    // if (wsPingInterval === null || wsPingInterval === undefined) { /* emit error */ }
    // if (maxPongInterval === null || maxPongInterval === undefined) { /* emit error */ }
    // if (logLevel === null || logLevel === undefined) { /* emit error */ }
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
        console.log('async.each failed while client.on() was called'); // TESTING
      }
      next(err);
    });
  }
}

module.exports = Loader;