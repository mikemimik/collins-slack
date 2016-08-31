'use strict';
const convict = require('convict');
const Config = require('../configs');

function Configuration () {
  this.isConfigured = false;
  this.options = {};
  this.logLevel = null;

  // INFO: initialize convict
  Config.formats.forEach((f) => { convict.addFormat(f); });
  this.configObj = convict(Config.schema);
}

Configuration.prototype.configure = function configure () {

};

module.exports = Configuration;
