var co     = require('co'),
    jsData = require('js-data'),
    utils  = jsData.utils;

module.exports = function (resource, attrs, options) {

  // Keep a reference to ourselves
  var self = this;

  // Make sure we got data
  if (!attrs) {
    return utils.Promise.reject("No data was given");
  }

  // Always return a promise
  return co(function*() {
    throw "_create not implemented";
  });
};
