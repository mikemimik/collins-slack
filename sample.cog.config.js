'use strict';

/**
 * Filename: slack.cog-name.config.js
 *
 * Contents:
 * - name
 * - description
 * - triggers
 */

module.exports = {
  name: 'cog-name', // must be one word slug
  description: 'some cog for this service gear',
  triggers: {

    // Used for simple interactions
    first: 'first trigger',

    // Used for asynchronous tasks
    second: function(data, cb) {

      console.log('second trigger');
      cb(null);
    },
    third: function(data, context) {

      // Used for emitting events
      console.log('third trigger');
      context.emit(this.name, { });
    }
  }
};