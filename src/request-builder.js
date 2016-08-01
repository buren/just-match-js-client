'use strict';

var Promise = require('promise/lib/es6-extensions');
require('promise/lib/rejection-tracking').enable({ allRejections: true });

var NullCacheStore = require('./null-cache-store');
var nullCacheStore = new NullCacheStore()

var identityFn = function(o) { return o; };

var promiseRequest = function(request, route, params, parser, errorParser, cache) {
  return new Promise(function(resolve, reject) {
    var data = cache.fetch(route);
    if (data) {
      resolve({ data: data, parsed: parser(data), status: 200 });
      return;
    }

    var success = function(data, status) {
      cache.set(route, data);
      resolve({ data: data, parsed: parser(data), status: status });
    };

    var fail = function(data, status) {
      reject({ data: data, parsed: errorParser(data), status: status });
    };

    request(route, params, success, fail);
  });
};

var requestBuilder = function(route, request, cache, parser, errParser) {
  var successParser = parser || identityFn;
  var errorParser = errParser || identityFn;

  return {
    name: route,
    GET: function(params, fetchFromCache) {
      var cacheStore = fetchFromCache ? cache : nullCacheStore;
      return promiseRequest(request.get, route, params, successParser, errorParser, cacheStore);
    },
    POST: function(params) {
      return promiseRequest(request.post, route, params, successParser, errorParser, nullCacheStore);
    },
    PATCH: function(params) {
      return promiseRequest(request.patch, route, params, successParser, errorParser, nullCacheStore);
    },
    DELETE: function(params) {
      return promiseRequest(request.delete, route, params, successParser, errorParser, nullCacheStore);
    }
  }
};

module.exports = requestBuilder;
