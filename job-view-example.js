var Client = require('./lib/client')
var JSONAPIStore = require('./lib/stores/jsonapi-store')
var promiseModel = require('./lib/promise-model')

var client = new Client({
  promoCode: 'justarrived',
  baseURL: 'http://localhost:3001',
  __debug__: true,
  store: new JSONAPIStore()
})

var jobPage = client.jobs.draw(1)

var proccessComments = function(res) {
  var comments = res.data
  comments.map(function(comment) {
    console.log('COMMENT BODY:', comments[i].body)
  })
}

var jobPageData = function(res) {
  job.comments.index().GET().then(proccessComments)
}

// job.show().GET({ include: ['owner', 'comments'] }).then(jobPageData)
jobPage.show().GET({ include: ['owner', 'comments', 'language'] }).then(function(res) {
  var job = res.data
  var comment = job.comments[0]
  var success = function(res) {
    console.log(comment.language.enName)
  }
  promiseModel(comment.language, client.languages).then(success)
  console.log('owner name:', job.owner.firstName, 'description:', job.owner.description)

})

client.jobs.index().GET({size: 3}).then(function(res) {
  var jobs = res.data
  jobs.map(function(job) {
    console.log('JOB', job.id, job.name)
  })
})
