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
  return new utils.Promise(function(resolve,reject) {
    return co(function* () {

      // Make sure we have an ID
      attrs[resource.idAttribute] = attrs[resource.idAttribute] || (yield self.generateId(resource));

      // Generate the create params
      var params = {
        index : self.index,
        type  : resource.name,
        id    : attrs[resource.idAttribute],
        body  : attrs
      };

      // Insert the new record
      self.connection.create(params, function(err, response) {

        // Hand the error over to the promise
        if ( err ) {
          return reject(err);
        }

        // Return our success
        resolve([ attrs, {} ]);
      });
    });
  });
};
