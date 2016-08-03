'use strict'

var Client = require('./lib/client')
var JSONAPIStore = require('./lib/stores/jsonapi-store')
var promiseModel = require('./lib/promise-model')

var Promise = require('promise/lib/es6-extensions')
require('promise/lib/rejection-tracking').enable({ allRejections: true })

var client = new Client({
  promoCode: 'justarrived',
  baseURL: 'http://localhost:3001',
  __debug__: true
})

var email = 'admin@example.com'
var password = '123456'

var sessionData = {
  data: {
    attributes: {
      'email-or-phone': email,
      password: password
    }
  }
}

function logResponse(res) {
  console.log('Logging', res.status, res.data)
}

var userSuccess = function(res) {
  var user = res.data
  console.log('USER', user.firstName, user.lastName, user.email, user.ssn)

  var userPage = client.users.draw(user.id)
  promiseModel(user.language, client.languages).then(function(res) {
    var lang = res.data
    console.log('USER LANG:', lang.enName)
  })

  userPage.chats.index().GET({include: ['messages']}).then(function(res) {
    var chats = res.data
    console.log('Chats len', chats.length)
    chats.map(function(chat) {
      console.log('chat msg len', chat.messages.length)
      chat.messages.map(function(message) {
        return message.body
      })
    })
  })
}

var sessionsSuccess = function(res) {
  var session = res.data
  var token = session.id

  var userId = session.userId
  var locale = session.locale
  client.setUserToken(token)
  client.setUserLocale(locale)

  console.log('LOCALE: ', locale)
  client.users.show(userId).GET().then(userSuccess, logResponse)

  var jobPage = client.jobs.draw(1)
  jobPage.show().GET().then(function(res) {
    jobPage.jobUsers.index().GET().then(function(res) {
      var jobUsers = res.data
      jobUsers.map(function(jobUser) {
        console.log('jobUser#willPerform', jobUser.willPerform)
      })
    })
  })

  // LOGOUT
  // client.users.sessions.show(token).DELETE(data).then(function(res) {
  //   console.log('LOGGED OUT', res)
  // })
}

var jobsSuccess = function(res) {
  var jobs = res.data
  jobs.map(function(job) {
    console.log(job.owner.firstName, 'created', job.name, 'last created at', job.createdAt.substr(0, 10))
  })

  // To demonstrate that the cache works, make the same request again (no request should be logged)
  client.jobs.index().GET({ sort: ['-updated-at'], include: ['owner'] }, true)
}

// client.jobs.index().GET({ sort: ['-updated-at'], include: ['owner'] }).then(jobsSuccess, logResponse)
// client.users.sessions.index().POST(sessionData).then(sessionsSuccess, logResponse)

var jobId = 1;
var jobPage = client.jobs.draw(jobId);
console.log('page', jobPage)
Promise.all([
  jobPage.show().GET({ include: ['owner'] }),
  jobPage.comments.index().GET(),
  jobPage.skills.index().GET()
]).then(function() {
  var store = client.store
  var job = store.find('jobs', jobId)
  console.log(job.owner.firstName, 'created', job.name, 'last created at', job.createdAt.substr(0, 10))

  console.log('=== All done ===')
})

JSONAPIStore
