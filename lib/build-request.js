'use strict'

var Promise = require('promise/lib/es6-extensions')
require('promise/lib/rejection-tracking').enable({ allRejections: true })

var promiseRequest = require('./promise-request')

var buildRequest = function(baseURL, route, request, store) {
  var href = baseURL + route
  var path = route

  return {
    href: href,
    path: path,
    name: path,
    GET: function(params, fetchFromCache) {
      return promiseRequest(request.get, route, params, store, fetchFromCache)
    },
    POST: function(params) {
      return promiseRequest(request.post, route, params, store)
    },
    PATCH: function(params) {
      return promiseRequest(request.patch, route, params, store)
    },
    DELETE: function(params) {
      return promiseRequest(request.delete, route, params, store)
    }
  }
}

module.exports = buildRequest
