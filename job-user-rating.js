var url = 'https://just-match-api-sandbox.herokuapp.com'

var Client = require('./lib/client')
var client = new Client({ baseURL: url })

var jobId = 1
var jobPage = client.jobs.draw(jobId)

function parseRatings(ratings) {
  if (!ratings) return

  for (var j = 0; j < ratings.length; j++) {
    var rating = ratings[j]
    console.log(rating.score)
  }
}

function parseJobUsers(jobUsers) {
  if (!jobUsers) return

  for (var i = 0; i < jobUsers.length; i++) {
    var jobUser = jobUsers[i]
    console.log('job-user', jobUser.id, jobUser.accepted, jobUser.willPerform, jobUser.performed)
    parseRatings(jobUser.ratings)
  }
}

function parseComments(comments) {
  if (!comments) return
  for (var i = 0; i < comments.length; i++) {
    var comment = comments[i]
    console.log('comment ', comment.id, comment.body)
  }
}

// GET:
//  job
//    jobUsers
//      ratings
//    owner
function doIt() {
  Promise.all([
    jobPage.show().GET({ include: ['owner'] }),
    jobPage.jobUsers.index().GET({ include: ['ratings'] }),
    jobPage.skills.index().GET(),
    jobPage.comments.index().GET()
  ]).then(function() {
    var job = client.store.find('jobs', jobId)
    console.log('job', job.id, job.name)
    parseComments(job.comments)
    parseJobUsers(job.jobUsers)
  })
}

var email = 'admin@example.com'
var password = '12345678'

client.users.sessions.index().POST({
  data: {
    attributes: {
      'email-or-phone': email,
      password: password
    }
  }
}).then(function(page) {
  var session = page.data
  client.setUserToken(session.id) // Login

  doIt();
}, function(res) {
  console.log('ERROR', JSON.stringify(res))
})
