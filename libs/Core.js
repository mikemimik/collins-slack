'use strict';

// INFO: service-gear specific modules
const Configuration = require('./Configuration');
const Loader = require('../utils/Loader');

// INFO: common modules
const Emitter = require('eventemitter2').EventEmitter2;
const Async = require('async');

// INFO: npm-service-module
const Slack = require('@slack/client');

class CollinsSlack extends Emitter {
  constructor () {
    super({ wildcard: true, delimiter: ':' });
    this.swg = null;
    this.cogs = [];
    this.actions = [];
    this.configuration = new Configuration();
    this.Runtime = require('../utils/Runtime');
    // INFO: internally storying info for convenience
    // TODO: don't do this
    this._EVENTS = {
      CLIENT: Slack.CLIENT_EVENTS.RTM,
      API: Slack.RTM_EVENTS
    };
  }

  init (sgw, next) {
    this.logger = sgw.logger;
    this.logger.filters.push(this.configuration.options.logger.filter.gear);
    this.logger.debug(this.constructor.name, 'Core#init', { from: 'gear' });
    Async.series([
      Loader.initConfig.bind(this, sgw.config),
      Loader.initGear.bind(this),
      // Loader.initCogs.bind(this)
      Loader.initListeners.bind(this)
    ], (err, results) => {
      if (err) {
        // TODO: emit an error up to collins
        // next(err);
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
