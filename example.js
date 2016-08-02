'use strict';

var Client = require('./lib/client');
// var Store = require('./lib/simple-cache-store');
var JSONAPIStore = require('./lib/jsonapi-store');
var promiseModel = require('./lib/promise-model');

var client = new Client({
  promoCode: 'justarrived',
  baseURL: 'http://localhost:3001',
  __debug__: true,
  store: new JSONAPIStore()
});

var email = 'admin@example.com';
var password = '123456';

var sessionData = {
  data: {
    attributes: {
      'email-or-phone': email,
      password: password
    }
  }
};

function logResponse(res) {
  console.log('Logging', res.status, res.data);
};

var userSuccess = function(res) {
  var user = res.data;
  console.log('USER', user.firstName, user.lastName, user.email, user.ssn);

  var userPage = client.users.draw(user.id);
  promiseModel(user.language, client.languages).then(function(res) {
    var lang = res.data;
    console.log('USER LANG:', lang.enName);
  })

  userPage.chats.index().GET({include: ['messages']}).then(function(res) {
    var chats = res.data;

    console.log('Chats len', chats.length);
    for (var i = 0; i < chats.length; i++) {
      var chat = chats[i];
      console.log('chat msg len', chat.messages.length);
      for (var i = 0; i < chat.messages.length; i++) {
        var message = chat.messages[i];
      }
    }
  });
};

var sessionsSuccess = function(res) {
  var session = res.data;
  var token = session.id;

  var userId = session.userId;
  var locale = session.locale
  client.setUserToken(token);
  client.setUserLocale(locale);

  console.log('LOCALE: ', locale);
  client.users.show(userId).GET().then(userSuccess, logResponse);


  var jobPage = client.jobs.draw(1);
  jobPage.show().GET().then(function(res) {
    jobPage.jobUsers.index().GET().then(function(res) {
      for (var i = 0; i < res.data.length; i++) {
        var jobUser = res.data[i];
        // ..
      }
    });
  });

  // LOGOUT
  // client.users.sessions.show(token).DELETE(data).then(function(res) {
  //   console.log('LOGGED OUT', res);
  // });
};

var jobsSuccess = function(res) {
  var data = res.data.data;
  var job;
  console.log('=== JOBS START ===');
  for (var i = 0; i < data.length; i++) {
    job = data[i].attributes;
    console.log(data[i]['id'], job['name'], job['updated-at']);
  }
  console.log('=== JOBS END ===');

  // To demonstrate that the cache works, make the same request again (no request should be logged)
  client.jobs.index().GET({sort: ['-updated-at']}, true);
  console.log('STORE LENGTH', client.cache.findAll('jobs').length);
};

client.jobs.index().GET({sort: ['-updated-at']}, true).then(jobsSuccess, logResponse);
client.users.sessions.index().POST(sessionData).then(sessionsSuccess, logResponse);
