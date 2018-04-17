var jsData = require('js-data'),
    utils  = jsData.utils;

module.exports = function (mapper, def, records, __opts) {

  // Keep a reference to ourselves
  var self = this;

  // Be consistent
  if (utils.isObject(records) && !utils.isArray(records)) {
    records = [records];
  }

  // Check for custom relation functions
  if (mapper.relations[def.type][def.relation].get) {
    var p = [];
    // Simply run through that get then
    records.forEach(function (record) {
      p.push(
        mapper.relations[def.type][def.relation]
          .get({}, {}, record, {})
          .then(function (relatedItems) {
            def.setLocalField(record, relatedItems);
          })
      );
    });
    return Promise.all(p);
  } else {

    // Fetch all the keys we're working with
    var relationDef = def.getRelation(),
        keys        = [];
    records.forEach(function(record) {
      keys.push(self.makeBelongsToForeignKey(mapper, def, record));
    });

    // Fetch all those records
    var query = { where: {} };
    query.where[relationDef.idAttribute] = { 'in': keys };
    return self.findAll(relationDef, query, __opts)
      .then(function(relatedItems) {
        // Merge those 2
        records.forEach(function(record) {
          relatedItems.forEach(function(relatedItem) {
            if ( relatedItem[relationDef.idAttribute] === record[def.foreignKey] ) {
              def.setLocalField(record,relatedItem);
            }
          });
        });
      });
  }
};
