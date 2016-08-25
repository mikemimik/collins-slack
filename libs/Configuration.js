'use strict';
const convict = require('convict');
const Config = require('../configs');

function Configuration () {
  this.isConfigured = false;
  this.options = {
    logger: Config.logger
  };

  // INFO: initialize convict
  Config.formats.forEach((f) => { convict.addFormat(f); });
  this.configObj = convict(Config.schema);
}

Configuration.prototype.configure = function configure () {

};

Configuration.prototype.setPath = function setPath (p) {

};

module.exports = Configuration;
