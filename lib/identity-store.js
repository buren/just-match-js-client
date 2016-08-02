'use strict';

var IdentityStore = function() {
  this.store = {},
  this.fetch = function(route) { return null; };
  this.set = function(route, data) { return data; };
  this.error = function(data) { return data; };
};

module.exports = IdentityStore;
