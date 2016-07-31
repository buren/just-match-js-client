var JsonApiDataStore = require('jsonapi-datastore').JsonApiDataStore;

var Store = function() {
  var self = this;
  self.store = new JsonApiDataStore();

  self.sync = function(data) { return self.store.sync(data); };
  self.syncWithMeta = function(data) { return self.store.syncWithMeta(data); };
  self.findAll = function(name) { return self.store.findAll(name); };
  self.find = function(name, id) { return self.store.find(name, id); };
  self.serialize = function() { return self.store.serialize(); };
};

module.exports = Store;
