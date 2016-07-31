var CacheStore = {
  store: {},
  fetch: function(route) {
    var cache = this.store[route];
    if (cache) {
      return cache;
    }

    return null;
  },
  set: function(route, data) {
    this.store[route] = data;

    return {};
  }
};

module.exports = CacheStore;
