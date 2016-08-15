'use strict'

function Logger(options) {
  var self = this;
  var opts = options || {}

  self.name = opts.name || ''
  self.setName = function(name) {
    self.name = name
  }

  self.prefix = function(type) {
    return '[' + [self.name, type].join('::') + ']'
  }

  self.__debug__ = opts.debug || false
  self.setDebug = function(debug) {
    self.__debug__ = debug ? true : false
  }

  self.info = function() {
    self._smartPrint('error', arguments, 'INFO')
  }

  self.warn = function() {
    self._smartPrint('error', arguments, 'WARN')
  }

  self.error = function() {
    self._smartPrint('error', arguments, 'ERROR')
  }

  self.debug = function() {
    if (self.debug) {
      self._smartPrint('info', arguments, 'DEBUG')
    }
  }

  self._smartPrint = function(fnName, args, prefix) {
    var prefix = self.prefix(prefix)
    if (args.length == 4) {
      console[fnName](prefix, args[0], args[1], args[2], args[3])
    } else if (args.length == 3) {
      console[fnName](prefix, args[0], args[1], args[2])
    } else if (args.length == 2) {
      console[fnName](prefix, args[0], args[1])
    } else {
      console[fnName](prefix, args[0])
    }
  }
}

module.exports = Logger
