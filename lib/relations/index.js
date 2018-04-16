module.exports = function (adapter) {
  adapter.loadBelongsTo           = require('./loadBelongsTo');
  adapter.loadHasMany             = require('./loadHasMany');
  adapter.loadHasManyForeignKeys  = require('./loadHasManyForeignKeys');
  adapter.loadHasManyLocalKeys    = require('./loadHasManyLocalKeys');
  adapter.loadHasOne              = require('./loadHasOne');
  adapter.makeBelongsToForeignKey = require('./makeBelongsToForeignKey');
  adapter.makeHasManyForeignKey   = require('./makeHasManyForeignKey');
  adapter.makeHasManyLocalKeys    = require('./makeHasManyLocalKeys');
};
