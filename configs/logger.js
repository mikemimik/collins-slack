'use strict';

const Colors = require('colors/safe');

const gearLoggingFilter = function gearLoggingFilter (level, msg, meta) {
  if (meta) {
    if (meta.from) {
      return '<' + Colors.magenta(meta.from) + '> ' + msg;
    }
  }
  return msg;
};

const serviceLoggingFilter = function serviceLoggingFilter (level, msg, meta) {
  return '<' + 'gear' + '> ' + msg;
};

module.exports = {
  filter: {
    gear: gearLoggingFilter,
    service: serviceLoggingFilter
  }
};
