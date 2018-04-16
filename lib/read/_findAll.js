var jsData = require('js-data'),
    utils  = jsData.utils;

function escape(str, quote) {
  quote = quote || false;
  "\\ + - && || ! ( ) { } [ ] ^ \" ~ * ? :".split(' ').forEach(function (orig) {
    str = str.split(orig).join('\\' + orig);
  });
  return (quote?'"':'') + str + (quote?'"':'')
}

// How to map stuff
var operatorMap = {
  '===' : function (field, value, output) {
    output.q = output.q || '';
    if ( output.q.length ) output.q += ' AND ';
    output.q += escape(field) + ':' + escape(value,true);
  },
  'in'  : function (field, values, output) {
    output.q = output.q || '';
    if ( output.q.length ) output.q += ' AND ';
    output.q += escape(field) + ':(' + values.map(function(value) {
      return escape(value,true);
    }).join(' OR ') + ')';
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
    var query = {
      index : self.index + '_' + resource.name,
      type : resource.name,
      size : params.limit || 1e4
    };

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
    self.client.search(query, function (error, response) {

      // 404 = no entries
      if (error && (error.status === 404)) {
        return resolve([[], {}]);
      }

      // Pass other errors to the promise
      if ( error ) {
        return reject(error);
      }

      // Map the results
      var hits = (response && response.hits && response.hits.hits || []).map(function (hit) {
        return hit && hit._source || (function () {
          var result                   = {};
          result[resource.idAttribute] = hit && hit._id || null;
          return result;
        })();
      });

      // Let js-data handle all filters we do not support
      var jsdQuery = new jsData.Query({
        index : {
          getAll : function () {
            return hits;
          }
        }
      });

      // Return what we've found
      resolve([jsdQuery.filter(params).run(), {}]);
    });

  });
};
