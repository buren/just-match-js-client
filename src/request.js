var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

function noop() {};

function onRequestError(_event) {
  console.error('An error occurred during the transaction');
};

function buildFilerParams(filter) {
  var builtFilter = [];
  var value, paramName;

  for (var name in filter) {
    if (filter.hasOwnProperty(name)) {
      value = filter[name];
      paramName = 'filter[' + name + ']=';
      builtFilter.push(encodeURIComponent(paramName + filter[name]));
    }
  }
  return builtFilter.join('&');
}

function buildParams(params) {
  var sort = 'sort=' + ((params || {}).sort || []).join(',');
  var filter = buildFilerParams((params || {}).filter || []);

  return [sort, filter].join('&');
}

function isSuccessStatus(status) {
  return status >= 200 && status < 400;
}

function Request(options) {
  var self = this;
  self.baseURL = options.baseURL || 'https://api.justarrived.se/api/v1';
  self.promoCode = options.promoCode;
  self.userLocale = options.locale;
  self.userToken = options.userToken;
  self.__debug__ = options.__debug__;

  self.setRequestHeaders = function(request) {
    request.setRequestHeader('Content-Type', 'application/vnd.api+json;charset=UTF-8');

    var promoCode = self.promoCode;
    var userToken = self.userToken;
    var userLocale = self.userLocale;

    if (promoCode) {
      request.setRequestHeader('x-api-promo-code', promoCode);
    }

    if (userLocale) {
      request.setRequestHeader('x-api-locale', userLocale);
    }

    if (userToken) {
      request.setRequestHeader('Authorization', 'Token ' + userToken);
    }
  };

  self.setUserToken = function(token) {
    self.userToken = token;
  };

  self.setUserLocale = function(locale) {
    self.userLocale = locale;
  };

  self.get = function(url, params, success, fail) {
    success = success || noop;
    fail = fail || noop;

    var fullURL =  self.baseURL + url + '?' + buildParams(params);
    if (self.__debug__) {
      console.log('REQUESTING URL: ', fullURL);
    }

    var request = new XMLHttpRequest();
    request.open('GET', fullURL, true);
    self.setRequestHeaders(request);

    request.onload = function() {
      var data = JSON.parse(this.responseText);
      var status = this.status;

      if (isSuccessStatus(status)) {
        success(data, status);
      } else {
        // Target server reached, but it returned an error
        fail(data, status);
      }
    };

    // Connection error
    request.onerror = onRequestError;

    request.send();
  };

  self.post = function(url, data, success, fail) {
    success = success || noop;
    fail = fail || noop;

    var request = new XMLHttpRequest();
    var fullURL = self.baseURL + url;

    if (self.__debug__) {
      console.log('POSTING TO URL: ', fullURL);
      console.log('POSTING DATA: ', data);
    }

    request.onreadystatechange = function() {
      // check if request has been completed
      if (this.readyState !== 4) {
        return;
      }

      var status = this.status;
      var data;

      if (isSuccessStatus(status)) {
        data = JSON.parse(this.responseText);
        success(data, status);
      } else {
        // Server doesn't return JSON for 500 or 404 status
        data = status === 500 || status === 404  ? {} : JSON.parse(this.responseText);
        // Target server reached, but it returned an error
        fail(data, status)
      }
    };

    // Connection error
    request.onerror = onRequestError;

    request.withCredentials = true;
    request.open('POST', fullURL);
    self.setRequestHeaders(request);
    request.setRequestHeader('cache-control', 'no-cache');

    request.send(JSON.stringify(data));
  };
};

module.exports = Request;
