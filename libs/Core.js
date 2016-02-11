'use strict';

// INFO: service-gear specific modules
const CoreError = require('./CoreError');
const Loader = require('../utils/Loader');
const Listeners = require('./Listeners');

// INFO: common modules
const Emitter = require('events');
const async = require('async');
const _ = require('lodash');

// INFO: npm-service-module
const Slack = require('slack-client');

class CollinsSlack extends Emitter.EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.initialized = false;
    this.cogs = [];
    this.actions = [];
    this._client = null;
    this._EVENTS = {
      CLIENT: Slack.EVENTS.CLIENT.RTM,
      API: Slack.EVENTS.API.EVENTS
    };
    this.Runtime = require('../utils/Runtime');
  }

  init(next) {
    async.series([
      Loader.initConfig.bind(this),
      Loader.initGear.bind(this),
      Loader.initCogs.bind(this),
      Loader.initActions.bind(this)
    ], (err, result) => {
      this.initialized = true;

      // INFO: all the initializations have been completed
      console.log('>>', 'TESTING', this.constructor.name, 'finished init', 'RESULT:', result);
      next(err);
    });
  }

  log() {}

  connect(next) {
    const Client = Slack.RtmClient;

    // INFO: making assumption config file has been processed
    this._client = new Client(this.config.token, { logLevel: this.config.debug });
    this._client.start();
    this._client.on(this._EVENTS.API.MESSAGE, Listeners.onMessage.bind(this));
  }

  disconnect() {
    this._client.disconnect();
  }
}

module.exports = CollinsSlack;