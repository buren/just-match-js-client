var Client = require('./lib/client');
var Store = require('./lib/store');
var JSONAPIStore = require('./lib/jsonapi-store');
var promiseModel = require('./lib/promise-model');

var store = new Store();
var client = new Client({
  promoCode: 'justarrived',
  baseURL: 'http://localhost:3001',
  __debug__: true,
  store: new JSONAPIStore()
});

var job = client.jobs.draw(1);

var proccessComments = function(res) {
  var comments = res.data;
  for (var i = 0; i < comments.length; i++) {
    console.log('COMMENT BODY:', comments[i].body);
  }
};

var jobPageData = function(res) {
  job.comments.index().GET().then(proccessComments);
}

job.show().GET({ include: ['owner', 'comments'] }).then(jobPageData);
job.show().GET({ include: ['owner', 'comments', 'language'] }).then(function(res) {
  var job = res.data;
  var comment = job.comments[0];
  var success = function(res) {
    console.log(comment.language.enName);
  };
  promiseModel(comment.language, client.languages).then(success);
});

// client.jobs.index().GET({size: 1, page: 21}).then(function(res) {
//   console.log('DATA', res.data);
// })
