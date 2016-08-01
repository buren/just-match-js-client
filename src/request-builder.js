'use strict';

var Promise = require('promise/lib/es6-extensions');
require('promise/lib/rejection-tracking').enable({ allRejections: true });

var NullCacheStore = require('./null-cache-store');
var nullCacheStore = new NullCacheStore()

var identityFn = function(o) { return o; };

var promiseRequest = function(request, route, params, cache) {
  return new Promise(function(resolve, reject) {
    var data = cache.fetch(route);
    if (data) {
      resolve({ data: data, status: 200 });
      return;
    }

    var success = function(data, status) {
      cache.set(route, data);
      resolve({ data: data, status: status });
    };

    var fail = function(data, status) {
      reject({ data: data, status: status });
    };

    request(route, params, success, fail);
  });
};

var requestBuilder = function(route, request, cache) {
  return {
    name: route,
    GET: function(params, fetchFromCache) {
      var cacheStore = fetchFromCache ? cache : nullCacheStore;
      return promiseRequest(request.get, route, params, cacheStore);
    },
    POST: function(params) {
      return promiseRequest(request.post, route, params, nullCacheStore);
    },
    PATCH: function(params) {
      return promiseRequest(request.patch, route, params, nullCacheStore);
    },
    DELETE: function(params) {
      return promiseRequest(request.delete, route, params, nullCacheStore);
    }
  };
};

module.exports = requestBuilder;
