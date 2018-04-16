var co     = require('co'),
    jsData = require('js-data'),
    utils  = jsData.utils;

module.exports = function(resource, id) {

  // Keep a reference to ourselves
  var self = this;

  // Always return a promise
  return co(function*() {
    throw "_destroy not implemented";
    // return [ undefined, {} ];
  });
};
