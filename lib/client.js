'use strict'

var buildRequest = require('./build-request')
var JustRequest = require('./just-request')
var IdentityStore = require('./stores/identity-store')
var SimpleStore = require('./stores/simple-store')
var JSONAPIStore = require('./stores/jsonapi-store')

var DEFAULT_URL = 'https://api.justarrived.se'
var DEFAULT_LOCALE = 'en'
var API_VERSION = 'v1'

function Sessions(client, base) {
  var name = base + '/sessions'
  return {
    index: function() { return client.buildRequest(name) },
    show: function(id) { return client.buildRequest(name + '/' + id) },
    draw: function(id) {
      return {
        show: function() { return client.buildRequest(name + '/' + id) }
      }
    }
  }
}

function Languages(client, base) {
  var name = base + '/languages'
  return {
    index: function() { return client.buildRequest(name) },
    show: function(id) { return client.buildRequest(name + '/' + id) },
    draw: function(id) {
      return {
        show: function() { return client.buildRequest(name + '/' + id) }
      }
    }
  }
}

function Comments(client, base) {
  var name = base + '/comments'
  return {
    index: function() { return client.buildRequest(name) },
    show: function(id) { return client.buildRequest(name + '/' + id) },
    draw: function(id) {
      return {
        show: function() { return client.buildRequest(name + '/' + id) }
      }
    }
  }
}

function Skills(client, base) {
  var name = base + '/skills'
  return {
    index: function() { return client.buildRequest(name) },
    show: function(id) { return client.buildRequest(name + '/' + id) },
    draw: function(id) {
      return {
        show: function() { return client.buildRequest(name + '/' + id) }
      }
    }
  }
}

function Messages(client, base) {
  var name = base + '/messages'
  return {
    index: function() { return client.buildRequest(name) }
  }
}

function Image(client, base) {
  var name = base + '/images'
  return {
    show: function(id) { return client.buildRequest(name + '/' + id) },
    draw: function(id) {
      return {
        show: function() { return client.buildRequest(name + '/' + id) }
      }
    }
  }
}

function Rating(client, base) {
  var name = base + '/ratings'
  return {
    index: function() { return client.buildRequest(name) }
  }
}

function Notifications(client, base) {
  var name = base + '/notifications'
  return {
    index: function() { return client.buildRequest(name) }
  }
}

function Faqs(client, base) {
  var name = base + '/faqs'
  return {
    index: function() { return client.buildRequest(name) }
  }
}

function Categories(client, base) {
  var name = base + '/categories'
  return {
    index: function() { return client.buildRequest(name) }
  }
}

function HourlyPays(client, base) {
  var name = base + '/hourly-pays'
  return {
    index: function() { return client.buildRequest(name) }
  }
}

function Countries(client, base) {
  var name = base + '/countries'
  return {
    index: function() { return client.buildRequest(name) }
  }
}

function Companies(client, base) {
  var name = base + '/companies'
  return {
    index: function() { return client.buildRequest(name) },
    show: function(id) { return client.buildRequest(name + '/' + id) },
    draw: function(id) {
      return {
        show: function() { return client.buildRequest(name + '/' + id) },
        images: Image(client, name + '/' + id)
      }
    }
  }
}

function TermsAgreements(client, base) {
  var name = base + '/terms-agreements'
  return {
    current: function() { return client.buildRequest(name + '/current') },
    currentCompany: function() { return client.buildRequest(name + '/current-company') }
  }
}

var Chats = function(client, base, deep) {
  var name = base + '/chats'

  var baseRoutes = {
    index: function() { return client.buildRequest(name) },
    show: function(id) { return client.buildRequest(name + '/' + id) },
    draw: function(id) {
      return {
        show: function() { return client.buildRequest(name + '/' + id) }
      }
    }
  }

  if (!deep) {
    return baseRoutes
  }

  return {
    index: baseRoutes.index,
    show: baseRoutes.show,
    draw: function(id) {
      return {
        show: function() { return baseRoutes.draw(id).show() },
        messages: Messages(client, baseRoutes.show(id).name)
      }
    }
  }
}

var Jobs = function(client, base, deep) {
  var name = base + '/jobs'

  var baseRoutes = {
    index: function() { return client.buildRequest(name) },
    show: function(id) { return client.buildRequest(name + '/' + id) },
    draw: function(id) {
      return {
        show: function() { return client.buildRequest(name + '/' + id) }
      }
    }
  }

  if (!deep) {
    return baseRoutes
  }

  return {
    index: baseRoutes.index,
    show: baseRoutes.show,
    draw: function(id) {
      return {
        matchingUsers: function() {
          return client.buildRequest(name + '/' + id + '/matching-users')
        },
        show: function() { return baseRoutes.draw(id).show() },
        comments: Comments(client, baseRoutes.show(id).name),
        skills: Skills(client, baseRoutes.show(id).name),
        jobUsers: Users(client, baseRoutes.show(id).name)
      }
    }
  }
}

var Users = function(client, base, deep) {
  var name = base + '/users'

  var baseRoutes = {
    index: function() { return client.buildRequest(name) },
    show: function(id) { return client.buildRequest(name + '/' + id) }
  }

  if (!deep) {
    return baseRoutes
  }

  return {
    index: baseRoutes.index,
    show: baseRoutes.show,
    matchingJobs: function(id) {
      return client.buildRequest(name + '/' + id + '/matching-jobs')
    },
    ownedJobs: function(id) {
      return client.buildRequest(name + '/' + id + '/owned-jobs')
    },
    notifications: Notifications(client, name),
    sessions: Sessions(client, name),
    draw: function(id) {
      return {
        show: function() { return client.buildRequest(name + '/' + id) },
        images: Image(client, baseRoutes.show(id).name),
        messages: Messages(client, baseRoutes.show(id).name),
        chats: Chats(client, baseRoutes.show(id).name),
        jobs: Jobs(client, baseRoutes.show(id).name),
        skills: Skills(client, baseRoutes.show(id).name),
        languages: Languages(client, baseRoutes.show(id).name),
        ratings: Rating(client, baseRoutes.show(id).name)
      }
    }
  }
}

var Client = function(options) {
  var self = this
  var opts = options || {}

  var requestOptions = {
    baseURL: (opts.baseURL || DEFAULT_URL) + '/api/' + API_VERSION,
    locale: opts.locale || DEFAULT_LOCALE,
    promoCode: opts.promoCode,
    userToken: opts.userToken || null,
    __debug__: opts.__debug__ || false
  }

  self.request = new JustRequest(requestOptions)
  self.store = opts.store || new JSONAPIStore()

  self.jobs = Jobs(self, '', true)
  self.users = Users(self, '', true)
  self.faqs = Faqs(self, '', true)
  self.skills = Skills(self, '', true)
  self.languages = Languages(self, '', true)
  self.categories = Categories(self, '', true)
  self.countries = Countries(self, '', true)
  self.hourlyPays = HourlyPays(self, '', true)
  self.companies = Companies(self, '', true)
  self.chats = Chats(self, '', true)
  self.termsAgreements = TermsAgreements(self, '', true)
  self.setUserToken = function(token) {
    self.request.setUserToken(token)
  }
  self.getUserToken = function() {
    self.request.getUserToken()
  }
  self.setUserLocale = function(locale) {
    self.request.setUserLocale(locale)
  }
  self.buildRequest = function(route) {
    return buildRequest(route, self.request, self.store)
  }
}

module.exports = Client
