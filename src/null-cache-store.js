'use strict';

var NullCacheStore = function() {
  this.store = {},
  this.fetch = function(route) { return null; };
  this.set = function(route, data) {};
};

module.exports = NullCacheStore;
