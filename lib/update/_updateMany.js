var co     = require('co'),
    jsData = require('js-data'),
    utils  = jsData.utils;

module.exports = function (resource, records) {

  // Keep a reference to ourselves
  var self = this;

  return new utils.Promise(function (resolve, reject) {
    reject('_updateMany not implemented');
    // return [ entities, {} ];
  });
};
