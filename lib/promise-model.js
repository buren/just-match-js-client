'use strict'

var Promise = require('promise/lib/es6-extensions')
require('promise/lib/rejection-tracking').enable({ allRejections: true })

function promiseModel(model, fetcher) {
  return new Promise(function(resolve, reject) {
    if (model._placeHolder) {
      fetcher.show(model.id).GET().then(resolve, reject)
    } else {
      resolve({ data: model, status: 200 })
    }
  })
}

module.exports = promiseModel
