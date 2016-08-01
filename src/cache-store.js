'use strict';

var CacheStore = function() {
  var self = this;
  self.store = {};

  self.fetch = function(route) {
    var cache = self.store[route];
    if (cache) {
      return cache;
    }

    return null;
  };

  self.set = function(route, data) {
    self.store[route] = data;

    return data;
  };
};

module.exports = CacheStore;
