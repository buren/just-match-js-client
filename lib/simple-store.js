'use strict';

var SimpleStore = function() {
  var self = this;
  self.store = {};

  self.fetch = function(route) {
    return self.store[route] || null;
  };

  self.set = function(route, data) {
    self.store[route] = data;

    return data;
  };

  self.error = function(data) {
    return data;
  };
};

module.exports = SimpleStore;
