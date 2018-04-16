var co     = require('co'),
    jsData = require('js-data'),
    utils  = jsData.utils;

module.exports = function (resource, attrs, params) {

  // Keep a reference to ourselves
  var self = this;

  return new utils.Promise(function (resolve, reject) {
    reject('_updateAll not implemented');
    // return [ entities, {} ];
  });
};
