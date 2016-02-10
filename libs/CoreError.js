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
class CoreError extends ExtendableError {
  constructor(type, data) {
    super('constructor'); // TODO: is this correct?
    this.data = data;

    this.message = '\'' + this.name + '\' caused an error';
    this.message += 'See \'data\' for details.';
  }
}

module.exports = CoreError;