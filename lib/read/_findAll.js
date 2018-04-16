var jsData = require('js-data'),
    utils  = jsData.utils;

// How to map stuff
var operatorMap = {
  '===' : function (field, value, output) {
    output.query              = output.query || {};
    output.query.match        = output.query.match || {};
    output.query.match[field] = output.query.match[field] || [];
    output.query.match[field].push(value);
  },
  'in'  : function (field, values, output) {
    values.forEach(function (value) {
      operatorMap['==='](field, value, output);
    });
  }
};

// Copy this
operatorMap['=='] = operatorMap['==='];
operatorMap['=']  = operatorMap['==='];

module.exports = function (resource, params) {

  // Keep a reference to ourselves
  var self = this;
  params   = self.normalizeQuery(params);

  // Always return a promise
  return new utils.Promise(function (resolve, reject) {

    // What we're going to pass to elasticsearch
    var query = {};

    // Add as many filters as we support
    Object.keys(params.where).forEach(function (keyword) {
      var config = params.where[keyword];
      Object.keys(config).forEach(function (operator) {
        if (operatorMap[operator]) {
          var value = config[operator];
          if ('undefined' === typeof value) {
            return;
          }
          operatorMap[operator](keyword, value, query);
        }
      });
    });

    // Run this query
    self.client.search({
      index : self.index,
      type  : resource.name,
      body  : query
    }, function (error, response) {

      // 404 = no entries
      if ( error && (error.status === 404) ) {
        return resolve([ [], {} ]);
      }

      console.log('ERR:', error);
      console.log('RESPONSE:', response);

      reject("_findAll not implemented");
      // return [ entities, {} ];
    });

  });
};
