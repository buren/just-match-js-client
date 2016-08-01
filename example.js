'use strict';

var Client = require('./src/client');
var CacheStore = require('./src/cache-store');

var client = new Client({
  promoCode: 'justarrived',
  baseURL: 'http://localhost:3001',
  __debug__: true,
  cache: new CacheStore()
});

var email = 'admin@example.com';
var password = '123456';

var data = {
  data: {
    attributes: {
      'email-or-phone': email,
      password: password
    }
  }
};

function logResponseError(res) {
  console.log('Logging', res.status, res.data);
};

var imageSuccess = function(res) {
  var data = res.data.data;
  var attributes = data.attributes;

  console.log('IMAGE URL:', attributes['image-url']);
  console.log('IMAGE CATEGORY:', attributes['category-name']);
};

var langSuccess = function(res) {
  var data = res.data.data;
  var attributes = data.attributes;

  console.log('LANG:', attributes['en-name']);
};

var messagesSuccess = function(res) {
  var data = res.data.data;
  var attributes;
  console.log('=== MESSAGES START ===');
  for (var i = 0; i < data.length; i++) {
    attributes = data[i].attributes;
    console.log('MESSAGE BODY:', attributes.body.substr(0, 50));
  }
  console.log('=== MESSAGES END ===');
}

var chatSuccess = function(res) {
  var data = res.data.data;
  var attributes = data.attributes;
  var id = data.id;
  var relations = data.relationships;
  var messages = relations.messages.data;

  console.log('MESSAGES LEN', messages.length);
  client.chats.draw(id).messages.index().GET().then(messagesSuccess);
};

var userSuccess = function(res) {
  var data = res.data.data;
  var attributes = data.attributes;
  var id = data.id;
  var relations = data.relationships;
  var languageId = relations.language.data.id;
  var images = relations['user-images'].data;
  var chats = relations['chats'].data;

  client.languages.show(id).GET().then(langSuccess, logResponseError);
  for (var i = 0; i < images.length; i++) {
    client.users.draw(id).images.show(images[0].id).GET().then(imageSuccess, logResponseError);
  }

  for (var i = 0; i < chats.length; i++) {
    client.users.draw(id).chats.show(chats[i].id).GET().then(chatSuccess, logResponseError);
  }

  console.log('EMAIL:', attributes['email']);
  console.log('DESCRIPTION:', attributes['description']);
  console.log('ID:', id);
  console.log('LANGUAGE:', languageId);
  console.log('CHATS LEN:', chats.length);
};

var sessionsSuccess = function(res) {
  var data = res.data.data;
  var token = data.id;
  var attributes = data.attributes;

  var userId = attributes['user-id'];
  var locale = attributes['locale']
  client.setUserToken(token);
  client.setUserLocale(locale);

  console.log('LOCALE: ', locale);
  client.users.show(userId).GET().then(userSuccess, logResponseError);

  // LOGOUT
  // client.users.sessions.show(token).DELETE(data).then(function(res) {
  //   console.log('LOGGED OUT', res);
  // });
};

var jobsSuccess = function(res) {
  var data = res.data.data;
  var job;
  console.log('JOBS:');

  for (var i = 0; i < data.length; i++) {
    job = data[i].attributes;
    console.log(data[i]['id'], job['name'], job['updated-at']);
  }
};


client.jobs.index().GET({sort: ['-updated-at']}, true).then(jobsSuccess, logResponseError);
// To demonstrate that the cache works, wait for the above response to finish
setTimeout(function() {
  client.jobs.index().GET({sort: ['-updated-at']}, true).then(jobsSuccess, logResponseError);
}, 1000)
client.users.sessions.index().POST(data).then(sessionsSuccess, logResponseError);
