var co     = require('co'),
    jsData = require('js-data'),
    utils  = jsData.utils;

module.exports = function(resource, params) {

  // Keep a reference to ourselves
  var self = this;

  // Always return a promise
  return co(function*() {

    // Fetch all entities we need to delete
    var entities = (yield self._findAll(resource, params)).shift();

    // Destroy them all

    throw "_destroyAll not implemented";
    // return [ undefined, {} ]


  });
};
