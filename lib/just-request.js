'use strict'

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

var Logger = require('./logger')
var logger = new Logger();
var buildParams = require('./build-params')

var BASE_URL = 'https://api.justarrived.se/api/v1'
var STATUS = { COMPLETED: 4 }

function noop() {}

function onRequestError(failFn) {
  return function(data, status) {
    logger.error('An error occurred during the transaction')
    return failFn({}, 500)
  }
}

function isServerSuccessStatus(status) {
  return status >= 200 && status < 400
}

function isServerErrorStatus(status) {
  return status === 500 || status === 404 || status === 0
}

function callResponse(response, success, fail) {
  var status = response.status
  var data

  logger.debug('RESPONSE: ' + status)

  if (isServerSuccessStatus(status)) {
    data = {}
    // No content status and therefore no content to parse..
    if (status !== 204) {
      data = JSON.parse(response.responseText)
    }
    success(data, status)
  } else if (isServerErrorStatus(status)) {
    // Server error doesn't return valid JSON
    fail({}, status)
  } else {
    // Validation/Authentication errors 422/401/403/413
    fail(JSON.parse(response.responseText), status)
  }
}

function JustRequest(options) {
  logger.setDebug(options.__debug__)
  logger.setName('Request')
  var self = this

  self.baseURL = options.baseURL || BASE_URL
  self.promoCode = options.promoCode
  self.userLocale = options.locale
  self.userToken = options.userToken

  logger.debug('BASE URL: ', self.baseURL)
  logger.debug('PROMOCODE: ', self.promoCode)
  logger.debug('USER LOCALE: ', self.userLocale)
  logger.debug('USER TOKEN: ', self.userToken)

  self.setRequestHeaders = function(request) {
    request.setRequestHeader('Content-Type', 'application/vnd.api+json;charset=UTF-8')

    var promoCode = self.promoCode
    var userToken = self.userToken
    var userLocale = self.userLocale

    if (promoCode) {
      request.setRequestHeader('x-api-promo-code', promoCode)
    }

    if (userLocale) {
      request.setRequestHeader('x-api-locale', userLocale)
    }

    if (userToken) {
      request.setRequestHeader('Authorization', 'Token ' + userToken)
    }
  }

  self.setUserToken = function(token) {
    self.userToken = token
  }

  self.setUserLocale = function(locale) {
    self.userLocale = locale
  }

  self.get = function(url, params, success, fail) {
    success = success || noop
    fail = fail || noop

    var fullURL =  self.baseURL + url + '?' + buildParams(params)

    logger.debug('REQUEST URL: ' + fullURL)

    var request = new XMLHttpRequest()
    request.open('GET', fullURL, true)
    self.setRequestHeaders(request)

    request.onload = function() {
      callResponse(this, success, fail)
    }

    // Connection error
    request.onerror = onRequestError(fail)

    request.send()
  }

  self.do = function(url, data, success, fail, verb) {
    success = success || noop
    fail = fail || noop

    var request = new XMLHttpRequest()
    var fullURL = self.baseURL + url

    logger.debug(verb + ' TO URL: ' + fullURL)
    logger.debug(verb + ' DATA: ' + JSON.stringify(data))

    request.onreadystatechange = function() {
      if (this.readyState !== STATUS.COMPLETED) {
        return
      }
      callResponse(this, success, fail)
    }

    // Connection error
    request.onerror = onRequestError(fail)

    request.withCredentials = true
    request.open(verb, fullURL, true)
    self.setRequestHeaders(request)
    request.setRequestHeader('cache-control', 'no-cache')

    request.send(JSON.stringify(data))
  }

  self.post = function(url, data, success, fail) {
    self.do(url, data, success, fail, 'POST')
  }

  self.patch = function(url, data, success, fail) {
    self.do(url, data, success, fail, 'PATCH')
  }

  self.delete = function(url, data, success, fail) {
    self.do(url, data, success, fail, 'DELETE')
  }
}

module.exports = JustRequest
