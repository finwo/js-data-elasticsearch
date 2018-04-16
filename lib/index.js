var jsData  = require('js-data'),
    Adapter = require('js-data-adapter').Adapter,
    elastic = require('elasticsearch');

function ElasticAdapter(opts) {
  Adapter.call(this, opts);

  if ('string' === typeof opts) {
    opts = {host : opts};
  }
  if ('object' !== typeof opts) {
    opts = {};
  }
  opts      = opts || {};
  opts.host = opts.host || 'localhost:9200';

  // Setup the connection
  this.index     = opts.index || 'test';
  this.client    = new elastic.Client(opts);
  this.connected = true;

  // Keep a reference to ourselves
  var self = this;

  // Monitor it
  setTimeout(function maintenance() {
    self.client.ping({
      requestTimeout : 2000
    }, function (error) {
      if (error) {
        // Crap, the connection is down
        // Let's try again quickly
        self.connected = false;
        setTimeout(maintenance, 100);
      } else {
        // All is well
        // Don't spam the server
        self.connected = true;
        setTimeout(maintenance, 5000);
      }
    });
  }, 5000);

  // Load all adapter functions
  require('./create')(this); // Create
  require('./read')(this);   // Read
  require('./update')(this); // Update
  require('./delete')(this); // Delete

  // Load extra functions
  require('./relations')(this);
  require('./helpers')(this);
}

ElasticAdapter.prototype = Object.create(Adapter.prototype, {
  constructor : {
    value        : ElasticAdapter,
    enumerable   : false,
    writable     : true,
    configurable : true
  }
});

Object.defineProperty(ElasticAdapter, '__super__', {
  configurable : true,
  value        : Adapter
});
