'use strict';

// INFO: service-gear specific modules
const Configuration = require('./Configuration');
const Loader = require('../utils/Loader');

// INFO: common modules
const Emitter = require('eventemitter2').EventEmitter2;
const async = require('async');

// INFO: npm-service-module
const Slack = require('@slack/client');

class CollinsSlack extends Emitter.EventEmitter2 {
  constructor(config) {
    super();
    this.config = config;
    this.logger = this.config.logger;
    delete this.config.logger;
    this.initialized = false;
    this.cogs = [];
    this.actions = [];
    this._EVENTS = {
      CLIENT: Slack.CLIENT_EVENTS.RTM,
      API: Slack.RTM_EVENTS
    };
    this.Runtime = require('../utils/Runtime');
  }

  init (next) {
    async.series([
      Loader.initConfig.bind(this),
      Loader.initGear.bind(this),
      Loader.initCogs.bind(this),
      Loader.initListeners.bind(this)
    ], (err, result) => {
      if (err) {
        // TODO: emit an error up to collins
      }
      this.initialized = true;

      // INFO: all the initializations have been completed
      this.logger.gear('TESTING', this.constructor.name, 'finished init', 'RESULT:', result);
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
