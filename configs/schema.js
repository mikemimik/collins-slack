'use strict';

let defaultSchema = {
  token: {
    doc: 'Token for Slack API',
    format: 'slack-token'
  },
  commandChar: {
    doc: 'Character to denote commands',
    format: 'single-char',
    default: '!'
  },
  userAgent: {
    doc: 'User Agent to use while accessing networks',
    format: 'inheritable',
    default: 'collins-slack'
  }
};

module.exports = defaultSchema;
