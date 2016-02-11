'use strict';

class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

/**
 * @summary Error class for delivering errors for this service-gear
 *
 * @param {String} type The error type name
 * @param {Object} data The data from the error
 */
class SlackError extends ExtendableError {
  constructor(type, data) {
    super('constructor'); // TODO: is this correct?
    this.data = (data) ? data : {};
    this.type = type;
    this.message = '\'' + type + '\' error message received';
    let reason = data.details || data.reason;
    if (reason) {
      this.message += ':\n"' + reason + '"\n';
    } else {
      this.message += '. ';
    }
    this.message += 'See \'data\' for details.';
  }
}

module.exports = SlackError;