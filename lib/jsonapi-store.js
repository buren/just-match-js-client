'use strict';

var Store = require('./store');

var JsonApiStore = function() {
  var self = this;
  self.store = {};
  self.datastore = new Store();

  self.fetch = function(route) {
    return self.store[route] || null;
  };

  self.set = function(route, data) {
    self.store[route] = data;
    var model = self.datastore.sync(data);

    var modelData = data.data;
    if (modelData.id) {
      // Find the single model and return it from the store
      model = self.datastore.find(modelData.type, modelData.id)
    }
    // Return a list of synced models
    return model;
  };

  // TODO: Add error parsing
  self.error = function(data) {
    return data;
  };
};

module.exports = JsonApiStore;
