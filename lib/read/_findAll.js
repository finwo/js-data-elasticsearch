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

    // Convert the arrays to csv
    if ( query.query && query.query.match ) {
      Object.keys(query.query.match).forEach(function(field) {
        query.query.match[field] = query.query.match[field].join(',');
      });
    }

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

      // Map the results
      var hits = (response && response.hits && response.hits.hits || []).map(function(hit) {
        return hit && hit._source || (function() {
          var result = {};
          result[resource.idAttribute] = hit && hit._id || null;
          return result;
        })();
      });

      // Let js-data handle all filters we do not support
      var jsdQuery = new jsData.Query({
        index: {
          getAll: function() {
            return hits;
          }
        }
      });

      // Return what we've found
      resolve([ jsdQuery.filter(params).run(), {} ]);
    });

  });
};
