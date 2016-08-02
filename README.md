# JustMatch API Client

A JavaScript client for [JustMatch API](https://github.com/justarrived/just_match_api).

## Install

```
npm install --save just-match-client
```

## Usage

```javascript
var Client = require('just-match-client');
var JsonApiStore = require('just-match-client/jsonapi-store');

var client = new Client({
  baseURL: 'http://localhost:3000',
  promoCode: 'xyz', // Optional
  __debug__: true  // Toggle debugging output
  store: new JsonApiStore() // JSONAPI Storage
});

var success = function(res) {
  var jobs = res.data;
  jobs.map(function(job) {
    console.log(job.id, job.name, job.updatedAt);
  });
};

// Get all jobs sorted by their updated-at attribute
client.jobs.index().GET({sort: ['-updated-at']})
  .then(success);
```

Fore more in depth examples see [`example.js`](example.js).

## Docs

__Stores__

Follows a simple protocol:

```javascript
var IdentityStore = function() {
  this.store = {},
  this.fetch = function(route) { return null; };
  this.set = function(route, data) { return data; };
  this.error = function(data) { return data; };
};

module.exports = IdentityStore;
```


## Todo

* Implement convenience methods for `login`/`logout`
* ...
