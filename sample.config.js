'use strict';

/**
 * Filename: slack.config.js
 *
 * Contents:
 * - token
 * - commandChar
 * - userAgent (should be inherited)
 * - logger
 *
 * Inheritables:
 * - commandChar
 * - userAgent
 * - logger
 * - debug
 */

module.exports = {
  token: 'xoxb-xxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx',
  commandChar: '!',
  userAgent: 'inherit',
  logger: 'inherit',
  debug: 'inherit'
};