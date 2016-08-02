'use strict';

var Promise = require('promise/lib/es6-extensions');
require('promise/lib/rejection-tracking').enable({ allRejections: true });

var promiseRequest = function(request, route, params, store, fetchFromCache) {
  return new Promise(function(resolve, reject) {
    var data;
    if (fetchFromCache) {
      data = store.fetch(route);
      if (data) {
        resolve({ data: data, status: 200 });
        return;
      }
    }

    var success = function(data, status) {
      resolve({ data: store.set(route, data), status: status });
    };

    var fail = function(data, status) {
      reject({ data: store.error(data), status: status });
    };

    request(route, params, success, fail);
  });
};

module.exports = promiseRequest;
