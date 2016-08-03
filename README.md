# JustMatch API Client

A JavaScript client for [JustMatch API](https://github.com/justarrived/just_match_api).

## Install

```
npm install --save just-match-client
```

## Usage

__Setup__

```javascript
var Client = require('just-match-client')

var client = new Client({
  baseURL: 'http://localhost:3000',
  promoCode: 'xyz', // Optional
  __debug__: true  // Toggle debugging output
})
```

__Examples__

All requests return a `Promise`

```javascript
// Get the latest 5 jobs
client.jobs.index().GET({ sort: ['-created-at'], size: 5 })
  .then(function(res) {
    var jobs = res.data
    console.log(jobs[0].name)
  }, function(res) {
    console.error('422/403/500/..');
  })
```

__Cache__
```javascript
// Add a true param to get previously seen requests from cache
client.jobs.index().GET({}, true)
// returns data never seen before so a request is made
client.jobs.index().GET({}, true)
// returns data from cache (no request is made and works with parameters)
```

__Login/Logout__

```javascript
// Login
client.users.sessions.index().POST(data).then(function(res) {
  var session = res.data
  client.setUserToken(session.id)
}, function() {
  console.log('Wrong email or password.')
})
```

```javascript
var token = client.getUserToken()
client.users.sessions.show(token).DELETE().then(function() {
  client.setUserToken(null)
})
```

__Fetch resources__

```javascript
var jobId = 1; // Take a job id
var jobPage = client.jobs.draw(jobId); // Draw the job page route

Promise.all([
  jobPage.show().GET({ include: ['owner'] }), // Get the job page and include the owner in the response
  jobPage.comments.index().GET({ include: ['language'] }), // Get all comments for job and include the language
  jobPage.skills.index().GET() // Get all skills for job
]).then(function() {
  var store = client.store // grab the client data store
  var job = store.find('jobs', jobId) // find the job id
  // Get job properties
  job.id
  job.name
  job.createdAt
  // Get relation properties
  job.owner.firstName
  job.comments[0].body
  job.comments[0].language.enName // Get relation of relations

  console.log('=== All done ===')
})
```

__Custom store (see details below)__:

```javascript
var Client = require('just-match-client')

var client = new Client({
  store: new IdentityStore()
})
```

For more in depth examples see [`example.js`](example.js) and [job-view-example.js](job-view-example.js).

## Parameters

All JSONAPI parameters are supported and you can pass to them to any request (they're all optional):

```javascript
{
  size: 5, // Page size of 5
  page: 2, // Page number two
  sort: ['-updated-at', 'created-at'], // Sort by updated descending and then by created ascending
  include: ['language', 'comments'], // Include relations
  filter: {
    'created-at': '2016-08-01..2016-09-01',
    'verified': 'true'
  }
}
```

## Stores

__Default store__: `JSONAPIStore`

Stores are a mechanism to cache and parse data returned from the client. Currently there are three stores available.

The simplest store available is the `IdentityStore`, no data is cached and no parsing is done.

```javascript
var IdentityStore = function() {
  this.store = {}
  this.fetch = function(route) { return null }
  this.set = function(route, data) { return data }
  this.error = function(data) { return data }
}

module.exports = IdentityStore
```

`SimpleStore` is `IdentityStore` with caching.

`JSONAPIStore` is more full fledged and provides both caching and parsing. It enables you to each response as model objects, as seen in the examples above.

## Todo

* Implement convenience methods for `login`/`logout`
* ...
