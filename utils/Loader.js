'use strict';

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
    next(null);
  }

  static initActions(next) {
    next(null);
  }
}

module.exports = Loader;