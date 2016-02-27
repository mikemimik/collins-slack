'use strict';

// INFO: common modules
const async = require('async');

class Service {

  /**
   * Function for interpreting messages
   */
  static interpret(data, context) {

    let selfId = context.Runtime.client.activeUserId;
    let self = context.Runtime.dataStore.users[selfId]; // INFO: is this needed?
    if (data.user === selfId) {
      return; // INFO: never respond to self
    }
    let tokens = data.text.split(' ');
    let mentions = tokens
      .filter((t) => t.slice(0,2) === '<@') // INFO: remove '<@' from beginning
      .map((t) => t.replace(/[\W_]+/g, '').trim()); // INFO: remove '>:' from end

    let mentionNames = mentions.map((m) => {
      if (!context.Runtime.dataStore.users[m]) {
        return 'Unknown';
      }
      return context.Runtime.dataStore.users[m].name;
    });

    let triggers = tokens.filter((t) => t.indexOf(context.config.commandChar) === 0);
    let parsed = data.text.replace(/\!([a-zA-Z])+\s?/g, '');

    let msg = {
      text: data.text,
      tokens: tokens,
      triggers: triggers,
      mentions: mentions,
      parsed: parsed,
      from: {
        id: data.user,
        username: context.Runtime.dataStore.users[data.user].name,
        channel: data.channel
      }
    };

    console.log('msg:', msg); // TESTING

    async.each(triggers, (t, foundTrigger_cb) => {
      let ct = t.substring(1);
      console.log('current found trigger:', t); // TESTING
      async.each(context.Runtime.cogs, (cog, eachCog_cb) => {
        console.log('current runtime cog:', cog);
        async.forEachOf(cog.triggers, (cmd, key, eachTrigger_cb) => {
          // key === trigger name
          // value === what to do
          console.log('current cog trigger:', key);
          if (ct === key) {
            console.log('same');
            if (typeof cmd === 'function') {
              // INFO: run the function
              eachTrigger_cb(null);
            } else if (typeof cmd === 'string') {
              context.Runtime.client.sendMessage(cmd, msg.from.channel);
              eachTrigger_cb(null);
            }
          } else {
            console.log('ct:', ct);
            console.log('key:', key);
          }
        }, (err) => {
          // INFO: all triggers for one cog have been processed
          eachCog_cb(err);
        });
      }, (err) => {
        // INFO: all cogs have been processsed
        foundTrigger_cb(err);
      });
    }, (err) => {
      console.log('Service class', 'error firing trigger', err); // TESTING
    });

  }
}

module.exports = Service;