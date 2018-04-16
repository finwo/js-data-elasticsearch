var co     = require('co'),
    jsData = require('js-data'),
    utils  = jsData.utils;

module.exports = function (resource, records) {
  // TODO: make this work

  // Keep a reference to ourselves
  var self = this;

  return new utils.Promise(function (resolve, reject) {
    console.log('_updateMany not implemented');
    reject('_updateMany not implemented');
    // return [ entities, {} ];
  });
};
