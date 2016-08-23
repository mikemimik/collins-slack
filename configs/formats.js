'use strict';

module.exports = [
  {
    name: 'slack-token',
    validate: function validateType (val) {
      let regex = new RegExp('^(xoxb-)');
      if (!regex.text(val)) {
        throw new Error('potentially invalid slack api token');
      }
    }
  },
  {
    name: 'single-char',
    validate: function validateType (val) {
      if (typeof val !== 'string') {
        throw new Error('must be of type string');
      } else if (val.length > 1) {
        throw new Error('must be sincle character');
      }
    }
  }
];
