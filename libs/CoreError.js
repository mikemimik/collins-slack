'use strict';

const ErrorTypes = require('./ErrorTypes');
const async = require('async');
const _ = require('lodash');

/**
 * @summary Error class for delivering errors for this service-gear
 *
 * @param {String} type Error type name
 * @param {Object} data Data given to the error
 */
class SlackError extends Error {
  constructor (type, data) {
    super();
    this.name = this.constructor.name;
    this.data = data || {};
    this.type = type;
    async.each(
      type.split(':'),
      function checkType (errorType, cb) {
        if (!_.includes(ErrorTypes, errorType.toLowerCase())) {
          cb(true);
        } else {
          cb(null);
        }
      },
      (err) => {
        if (err) {
          throw new SlackError('TypeError', {
            details: 'invalid error type give to error object'
          });
        } else {
          this.type = type;
        }
      }
    );
    this.message = `<${this.type}> error message received`;
    let reasons = this.data.details || this.data.reasons;
    if (reasons) {
      this.message += ': ';
      if (Array.isArray(reasons)) {
        reasons.forEach((reason, index) => {
          this.message += `${index + 1}> ${reason}`;
        });
      } else {
        this.message += `${reasons}`;
      }
    } else {
      this.message += '.';
    }
  }

  static convert (type, error) {
    // INFO: given an Error, return a SlackError
    let details = { details: error.message };
    return new SlackError(type, details);
  }
}

module.exports = SlackError;
