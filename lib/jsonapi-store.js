'use strict';

var Store = require('./store');
var humps = require('humps');

var JsonApiStore = function() {
  var self = this;
  self.store = new Store();

  var camelizeKeys = function(data) {
    return humps.camelizeKeys(data)
  };

  self.fetch = function(route) {
    return self.store[route] || null;
  };

  self.set = function(route, JSONAPIDocument) {
    // Sync data to store
    var model = self.store.sync(camelizeKeys(JSONAPIDocument));

    var data = JSONAPIDocument.data;
    if (data.id) {
      // Find the single model and return it from the store
      model = self.store.find(data.type, data.id);
    }

    self.store[route] = model;
    return model;
  };

  // TODO: Add error parsing
  self.error = function(data) {
    return data;
  };
};

module.exports = JsonApiStore;
