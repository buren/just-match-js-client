'use strict'

function stringify(object) {
  return JSON.stringify(object);
}

function Logger(options) {
  var self = this;
  var opts = options || {}

  self.debug = opts.debug || false

  self.info = function(string, object) {
    console.log(string, stringify(object))
  }

  self.error = function(string, object) {
    console.error(string, stringify(object))
  }

  self.debug = function(string, object) {
    if (self.debug) {
      self.info('[DEBUG] ' + string, object)
    }
  }
}

module.exports = Logger
