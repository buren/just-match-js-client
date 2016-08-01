'use strict';

var requestBuilder = require('./request-builder');
var Request = require('./request');
var NullCacheStore = require('./null-cache-store');

var DEFAULT_URL = 'https://api.justarrived.se';
var DEFAULT_LOCALE = 'en';
var API_VERSION = 'v1';

function Sessions(client, base) {
  var name = base + '/sessions';
  return {
    index: function() { return client.requestBuilder(name); },
    show: function(token) { return client.requestBuilder(name + '/' + token); }
  };
};

function Languages(client, base) {
  var name = base + '/languages';
  return {
    index: function() { return client.requestBuilder(name); },
    show: function(id) { return client.requestBuilder(name + '/' + id); }
  };
};

function Comments(client, base) {
  var name = base + '/comments';
  return {
    index: function() { return client.requestBuilder(name); },
    show: function(id) { return client.requestBuilder(name + '/' + id); }
  };
};

function Skills(client, base) {
  var name = base + '/skills';
  return {
    index: function() { return client.requestBuilder(name); },
    show: function(id) { return client.requestBuilder(name + '/' + id); }
  };
};

function Messages(client, base) {
  var name = base + '/messages';
  return {
    index: function() { return client.requestBuilder(name); }
  };
};

function Image(client, base) {
  var name = base + '/images';
  return {
    show: function(id) { return client.requestBuilder(name + '/' + id); }
  };
};

function Rating(client, base) {
  var name = base + '/ratings';
  return {
    index: function() { return client.requestBuilder(name); }
  };
};

function Notifications(client, base) {
  var name = base + '/notifications';
  return {
    index: function() { return client.requestBuilder(name); }
  };
};

function Faqs(client, base) {
  var name = base + '/faqs';
  return {
    index: function() { return client.requestBuilder(name); }
  };
};

function Categories(client, base) {
  var name = base + '/categories';
  return {
    index: function() { return client.requestBuilder(name); }
  };
};

function HourlyPays(client, base) {
  var name = base + '/hourly-pays';
  return {
    index: function() { return client.requestBuilder(name); }
  };
};

function Countries(client, base) {
  var name = base + '/countries';
  return {
    index: function() { return client.requestBuilder(name); }
  };
};

function Companies(client, base) {
  var name = base + '/companies';
  return {
    index: function() { return client.requestBuilder(name); },
    show: function(id) { return client.requestBuilder(name + '/' + id); },
    draw: function(id) {
      return { images: Image(client, name + '/' + id) };
    }
  };
};

function TermsAgreements(client, base) {
  var name = base + '/terms-agreements';
  return {
    current: function() { return client.requestBuilder(name + '/current'); },
    currentCompany: function() { return client.requestBuilder(name + '/current-company'); }
  };
};

var Chats = function(client, base, deep) {
  var name = base + '/chats';

  var baseRoutes = {
    index: function() { return client.requestBuilder(name); },
    show: function(id) { return client.requestBuilder(name + '/' + id); }
  };

  if (!deep) {
    return baseRoutes;
  }

  return {
    index: baseRoutes.index,
    show: baseRoutes.show,
    draw: function(id) {
      return { messages: Messages(client, baseRoutes.show(id).name) };
    }
  };
};

var Jobs = function(client, base, deep) {
  var type = 'jobs';
  var name = base + '/' + type;

  var baseRoutes = {
    index: function() { return client.requestBuilder(name); },
    show: function(id) {
      return client.requestBuilder(name + '/' + id);
    }
  };

  if (!deep) {
    return baseRoutes;
  }

  return {
    index: baseRoutes.index,
    show: baseRoutes.show,
    matchingUsers: function(id) {
      return client.requestBuilder(name + '/' + id + '/matching-users');
    },
    draw: function(id) {
      return {
        comments: Comments(client, baseRoutes.show(id).name),
        skills: Skills(client, baseRoutes.show(id).name),
        users: Users(client, baseRoutes.show(id).name)
      };
    }
  };
};

var Users = function(client, base, deep) {
  var name = base + '/users';

  var baseRoutes = {
    index: function() { return client.requestBuilder(name); },
    show: function(id) { return client.requestBuilder(name + '/' + id); }
  };

  if (!deep) {
    return baseRoutes;
  }

  return {
    index: baseRoutes.index,
    show: baseRoutes.show,
    matchingJobs: function(id) {
      return client.requestBuilder(name + '/' + id + '/matching-jobs');
    },
    ownedJobs: function(id) {
      return client.requestBuilder(name + '/' + id + '/owned-jobs');
    },
    notifications: Notifications(client, name),
    sessions: Sessions(client, name),
    draw: function(id) {
      return {
        images: Image(client, baseRoutes.show(id).name),
        messages: Messages(client, baseRoutes.show(id).name),
        chats: Chats(client, baseRoutes.show(id).name),
        jobs: Jobs(client, baseRoutes.show(id).name),
        skills: Skills(client, baseRoutes.show(id).name),
        languages: Languages(client, baseRoutes.show(id).name),
        ratings: Rating(client, baseRoutes.show(id).name)
      };
    }
  };
};

var Client = function(opts) {
  var self = this;

  var requestOptions = {
    baseURL: (opts.baseURL || DEFAULT_URL) + '/api/' + API_VERSION,
    locale: opts.locale || DEFAULT_LOCALE,
    promoCode: opts.promoCode,
    userToken: opts.userToken || null,
    __debug__: opts.__debug__ || false
  };

  self.request = new Request(requestOptions);
  self.cache = opts.cache || new NullCacheStore();

  self.jobs = Jobs(self, '', true);
  self.users = Users(self, '', true);
  self.faqs = Faqs(self, '', true);
  self.skills = Skills(self, '', true);
  self.languages = Languages(self, '', true);
  self.categories = Categories(self, '', true);
  self.countries = Countries(self, '', true);
  self.hourlyPays = HourlyPays(self, '', true);
  self.companies = Companies(self, '', true);
  self.chats = Chats(self, '', true);
  self.termsAgreements = TermsAgreements(self, '', true);
  self.setUserToken = function(token) {
    self.request.setUserToken(token);
  };
  self.setUserLocale = function(locale) {
    self.request.setUserLocale(locale);
  };
  self.requestBuilder = function(route) {
    return requestBuilder(route, self.request, self.cache);
  };
};

module.exports = Client;
