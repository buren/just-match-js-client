var promiseRequest = function(request, route, params, cacheStore, cache) {
  return new Promise(function(resolve, reject) {
    var store = cacheStore;
    if (cache && store.fetch(route)) {
      resolve({ data: store.fetch(route), status: 200 });
      return;
    }

    var success = function(data, status) {
      if (store) {
        store.set(route, data);
      }
      resolve({ data: data, status: status });
    };

    var fail = function(data, status) {
      reject({ data: data, status: status });
    };

    request(route, params, success, fail);
  });
};

var requestBuilder = function(route, getFn, postFn, cacheStore) {
  return {
    name: route,
    GET: function(params, cache) {
      return promiseRequest(getFn, route, params, cacheStore, cache);
    },
    POST: function(params) {
      return promiseRequest(postFn, route, params);
    },
  }
};

module.exports = requestBuilder;
