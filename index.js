var Client = require('./src/client');

var client = new Client({
  baseURL: 'http://localhost:3001',
  __debug__: true
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

var logResp = function(res) {
  console.log('Logging', res.status, res.data);
};

var jobsSuccess = function(res) {
  var data = res.data.data;
  var job;

  for (var i = 0; i < data.length; i++) {
    job = data[i].attributes;
    console.log(data[i]['id'], job['name'], job['updated-at']);
  }
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

var messageSuccess = function(res) {
  console.log('messageSuccess');
  var data = res.data.data;
  var attributes = data.attributes;

  console.log('MESSAGE BODY', attributes.data);
}

var chatSuccess = function(res) {
  var data = res.data.data;
  var attributes = data.attributes;
  var id = data.id;
  var relations = data.relationships;
  var messages = relations.messages.data;

  console.log('MESSAGES LEN', messages.length);
};

var userSuccess = function(res) {
  var data = res.data.data;
  var attributes = data.attributes;
  var id = data.id;
  var relations = data.relationships;
  var languageId = relations.language.data.id;
  var images = relations['user-images'].data;
  var chats = relations['chats'].data;

  client.languages.show(id).GET().then(langSuccess);
  for (var i = 0; i < images.length; i++) {
    client.users.draw(id).images.show(images[0].id).GET().then(imageSuccess, logResp);
  }

  for (var i = 0; i < chats.length; i++) {
    client.users.draw(id).chats.show(chats[0].id).GET().then(chatSuccess, logResp);
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
  client.users.show(userId).GET().then(userSuccess, logResp);
};

client.jobs.index().GET({sort: ['-updated-at']}, true).then(jobsSuccess, logResp)
client.users.sessions.index().POST(data).then(sessionsSuccess, logResp);
