var co     = require('co'),
    jsData = require('js-data'),
    utils  = jsData.utils;

module.exports = function (resource, id) {

  // Keep a reference to ourselves
  var self = this;

  // Make sure we got an id
  if (!id) {
    return utils.Promise.reject("No id was given");
  }

  // Always return a promise
  return new utils.Promise(function(resolve, reject) {

    // Let's delete it then
    self.client.delete({
      index : self.index + '_' + resource.name,
      type  : resource.name,
      id    : id
    }, function (error, response) {

      // 404 = not found
      if (error && (error.status === 404)) {
        return resolve([ undefined, {}]);
      }

      // Hand over the error to the promise
      if ( error ) {
        return reject(error);
      }

      // Return our success
      resolve([ undefined, {} ]);
    });
  });
};
