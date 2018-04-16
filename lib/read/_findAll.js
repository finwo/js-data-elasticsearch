var jsData = require('js-data'),
    utils  = jsData.utils;

module.exports = function (resource, params) {

  // Keep a reference to ourselves
  var self = this;
  params   = self.normalizeQuery(params);

  // Always return a promise
  return new utils.Promise(function(resolve, reject) {
    reject("_findAll not implemented");
    // return [ entities, {} ];
  });
};
