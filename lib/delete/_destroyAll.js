var co     = require('co'),
    jsData = require('js-data'),
    utils  = jsData.utils;

module.exports = function (resource, params) {
  // TODO: make this work

  // Keep a reference to ourselves
  var self = this;

  // Always return a promise
  return co(function* () {

    // Fetch all entities we need to delete
    var entities = (yield self._findAll(resource, params)).shift();

    // Convert entities into keys
    entities = entities.map(function (entity) {
      return entity[resource.idAttribute];
    });

    // Destroy them all
    var tasks = [];
    entities.forEach(function (key) {
      tasks.push(self._destroy(resource, key));
    });

    // Wait for the tasks to finish
    return Promise
      .all(tasks)
      .then(function (result) {
        return [undefined, {}];
      });
  });
};
