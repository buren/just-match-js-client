'use strict';

var Store = require('./store');
var datastore = new Store();

var JsonApiCacheStore = function() {
  var self = this;
  self.store = {};
  self.datastore = datastore;

  self.findAll = function(type) {
    return self.datastore.findAll(type);
  };

  self.find = function(type, id) {
    return self.datastore.find(type, id);
  };

  self.fetch = function(route) {
    var cache = self.store[route];
    if (cache) {
      return cache;
    }

    return null;
  };

  self.set = function(route, data) {
    self.store[route] = data;
    self.datastore.sync(data);

    return data;
  };
};

module.exports = JsonApiCacheStore;
