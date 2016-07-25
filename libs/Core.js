'use strict';

// INFO: service-gear specific modules
const Configuration = require('./Configuration');
const Loader = require('../utils/Loader');

// INFO: common modules
const Emitter = require('eventemitter2').EventEmitter2;
const async = require('async');

// INFO: npm-service-module
const Slack = require('@slack/client');

class CollinsSlack extends Emitter {
  constructor (coreConfig) {
    super({
      wildcard: true,
      delimiter: ':'
    });
    this.cogs = [];
    this.actions = [];
    this.configuration = new Configuration();
    this.configuration.files.push('index.js');
    this.Runtime = require('../utils/Runtime');
    // INFO: internally storying info for convenience
    // TODO: don't do this
    this._EVENTS = {
      CLIENT: Slack.CLIENT_EVENTS.RTM,
      API: Slack.RTM_EVENTS
    };
  }

  init (next) {
    // TODO: initialize logger
    async.series([
      Loader.initConfig.bind(this),
      Loader.initGear.bind(this),
      Loader.initCogs.bind(this),
      Loader.initListeners.bind(this)
    ], (err, results) => {
      if (err) {
        // TODO: emit an error up to collins
        next(err);
      }

      // INFO: A loader init stage errored
      results.forEach((result) => {
        if (result) {

        }
      });
      this.initialized = true;

      // INFO: all the initializations have been completed
      next(err);
    });
  }

  log () {}

  connect (next) {
    // TESTING
    // INFO: collect all emitted events and re-emit them
    // events(this.Runtime['client'], '*', function() {
    //   let args = Array.prototype.slice.apply(arguments);
    //   if (args[0] !== 'raw_message') {
    //     console.log('>>', 'TEST', 'CollinsSlack', 'event', args);
    //   }
    // });
    this.Runtime['client'].start();
    next(null);
  }

  disconnect () {
    this.Runtime['client'].disconnect();
  }
}

module.exports = CollinsSlack;
