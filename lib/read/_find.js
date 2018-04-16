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

    // Try to fetch our record
    self.client.get({
      index : self.index + '_' + resource.name,
      type  : resource.name,
      id    : id
    }, function (error, response) {

      // 404 = not found
      if (error && (error.status === 404)) {
        return resolve([ undefined, {}]);
      }

      // Pass other errors to the promise
      if ( error ) {
        return reject(error);
      }

      // Return our success
      resolve([ response && response._source || undefined, {} ]);
    });
  });
};
