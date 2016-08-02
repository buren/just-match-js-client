'use strict'

var Client = require('./lib/client')
var JSONAPIStore = require('./lib/jsonapi-store')
var promiseModel = require('./lib/promise-model')

var client = new Client({
  promoCode: 'justarrived',
  baseURL: 'http://localhost:3001',
  __debug__: true,
  store: new JSONAPIStore()
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
    console.log(job.id, job.name, job.updatedAt)
  })

  // To demonstrate that the cache works, make the same request again (no request should be logged)
  client.jobs.index().GET({sort: ['-updated-at']}, true)
}

client.jobs.index().GET({sort: ['-updated-at']}, true).then(jobsSuccess, logResponse)
client.users.sessions.index().POST(sessionData).then(sessionsSuccess, logResponse)
