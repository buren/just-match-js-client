# JustMatch API Client

A JavaScript client for [JustMatch API](https://github.com/justarrived/just_match_api).

## Install

```
npm install --save just-match-client
```

## Usage

```javascript
var Client = require('just-match-client');

var client = new Client({
  baseURL: 'http://localhost:3000',
  promoCode: 'xyz', // Optional
  __debug__: true  // Toggle debugging output
});

var success = function(res) {
  var data = res.data.data;
  var job;

  for (var i = 0; i < data.length; i++) {
    job = data[i].attributes;
    console.log(data[i]['id'], job['name'], job['updated-at']);
  }
};

var fail = function(res) {
  console.error('Something went wrong!');
}

// Get all jobs sorted by their updated-at attribute
client.jobs.index().GET({sort: ['-updated-at']})
  .then(success, fail);
```

Fore more in depth examples see [`example.js`](example.js).

## Todo

* Implement convenience methods for `login`/`logout`
* ...
