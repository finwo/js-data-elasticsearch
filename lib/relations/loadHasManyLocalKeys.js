var jsData = require('js-data'),
    utils  = jsData.utils;

module.exports = function (mapper, def, records, __opts) {

  // Keep a reference to ourselves
  var self          = this,
      relatedMapper = def.getRelation();

  // Stay consistent
  if ( utils.isObject(records) && !utils.isArray(records) ) {
    records = [records];
  }

  // Fetch all keys
  var localKeys = [];
  records.forEach(function(record) {
    localKeys = localKeys.concat(self.makeHasManyLocalKeys(mapper, def, record));
  });

  // Run everything
  var query = { where: {} };
  query.where[relatedMapper.idAttribute] = { 'in': localKeys };
  return self.findAll(relatedMapper, query, __opts)
             .then(function(relatedItems) {
               records.forEach(function(item) {
                 var attached = [],
                     itemKeys = utils.get(item, def.localKeys) || [];
                 itemKeys = utils.isArray(itemKeys) ? itemKeys : Object.keys(itemKeys);
                 relatedItems.forEach(function(relatedItem) {
                   if (itemKeys && itemKeys.indexOf(relatedItem[relatedMapper.idAttribute]) !== -1) {
                     attached.push(relatedItem);
                   }
                 });
                 def.setLocalField(item, attached);
               });
               return relatedItems;
             });
};
