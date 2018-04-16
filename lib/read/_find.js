var jsData = require('js-data'),
    utils  = jsData.utils;

module.exports = function (resource, id) {

  // Keep a reference to ourselves
  var self = this;


  // Escape now if we're trying to fetch undefined
  // This might happen during broken relations
  if ('undefined' === typeof id) {
    return utils.Promise.resolve([undefined, {}]);
  }

  // Always return a promise
  return new utils.Promise(function (resolve, reject) {
    reject("_find not implemented");
    // return [ entity, {} ]
  });
};
