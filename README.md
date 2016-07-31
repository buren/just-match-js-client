# JustMatch API Client

A JavaScript client for [JustMatch API](https://github.com/justarrived/just_match_api).

# Configuration

```JavaScript
var Client = require('./src/client');

var client = new Client({
  baseURL: 'http://localhost:3000',
  __debug__: true
});

// Get all jobs sorted by their updated at attribute
client.jobs.index().GET({sort: ['-updated-at']}).then(function(res) {
  var data = res.data.data;
  var job;

  for (var i = 0; i < data.length; i++) {
    job = data[i].attributes;
    console.log(job['id'], job['name'], job['updated-at']);
  }
});
```

# Usage

See [`index.js`](index.js) for an example.
