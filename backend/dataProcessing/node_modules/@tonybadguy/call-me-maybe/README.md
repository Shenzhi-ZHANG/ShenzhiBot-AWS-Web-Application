# @tonybadguy/call-me-maybe

[![npm version](https://badge.fury.io/js/%40tonybadguy%2Fcall-me-maybe.svg)](https://badge.fury.io/js/%40tonybadguy%2Fcall-me-maybe) [![Build Status](https://travis-ci.org/tonybadguy/call-me-maybe.svg?branch=master)](https://travis-ci.org/tonybadguy/call-me-maybe) [![codecov](https://codecov.io/gh/tonybadguy/call-me-maybe/branch/master/graph/badge.svg)](https://codecov.io/gh/tonybadguy/call-me-maybe) [![bitHound Overall Score](https://www.bithound.io/github/tonybadguy/call-me-maybe/badges/score.svg)](https://www.bithound.io/github/tonybadguy/call-me-maybe)

A Node.js module for creating REST clients with easy request model templating and straightforward extensibility

### A simple GET request :+1:
```javascript
const send = require('@tonybadguy/call-me-maybe');

send({
  url: 'https://httpbin.org/get'
}).then(response => {
  console.log(response.statusCode);
  console.log(response.body);
  console.log(response.headers);
  console.log(response.jsonBody.origin);
}).catch(error => {
  console.log(error);
});
```

### POST with body :sparkling_heart:
```javascript
send({
  url: 'https://httpbin.org/post',
  method: 'POST',
  body: 'my data'
}).then(response => {
  console.log(response.body);
  console.log(response.jsonBody.data); // 'my data'
});
```

### POST with object as json body :sparkles::sparkling_heart::sparkles:
```javascript
send({
  url: 'https://httpbin.org/post',
  method: 'POST',
  jsonBody: {
    foo: 'bar'
  }
}).then(response => {
  console.log(response.body);
  console.log(response.jsonBody.json.foo); // 'bar'
});
```

```Content-Type``` header is automatically set to ```application/json```.

### POST with object as urlencoded body :sparkles::scream::sparkles:
```javascript
send({
  url: 'https://httpbin.org/post',
  method: 'POST',
  urlencodedBody: {
    foo: 'bar'
  }
}).then(response => {
  console.log(response.jsonBody.form.foo); // 'bar'
});
```
```Content-Type``` header is automatically set to ```application/x-www-form-urlencoded```.

### Make it fancy with urlParams :sparkles::sparkling_heart::scream::sparkling_heart::sparkles:
```javascript
send({
  url: 'https://httpbin.org/{foo}',  // 'https://httpbin.org/get'
  urlParams:{
    foo:'get'
  }
}).then(response => {
  console.log(response.body);
});
```

### Or with a query :hand::dollar::dollar::dollar:
```javascript
send({
  url: 'https://httpbin.org/get',  // 'https://httpbin.org/get?foo=bar%20baz'
  query:{
    foo:'bar baz'
  }
}).then(response => {
  console.log(response.body);
});
```

### Set headers :collision::dizzy_face::collision:
```javascript
send({
  url: 'https://httpbin.org/get',
  headers:{
    'x-my-header':'oh hai'
  }
}).then(response => {
  console.log(response.body);
});
```

### Set bearer token authorization header :collision::revolving_hearts::dizzy_face::revolving_hearts::collision:
This is a shortcut for setting the Authorization header.

```javascript
send({
  url: 'https://httpbin.org/get',
  bearerToken: 'mytoken'
}).then(response => {
  console.log(response.body);
});
```

```Authorization``` header is set to ```Bearer mytoken```.

### Handle non-200 status :fire::poop::fire::ok_hand:
```javascript
send({
  url: 'https://httpbin.org/status/500'
}).then(response => {
  // won't be called
}).catch(error => {
  console.log(error.response.statusCode); // 500
});
```

## All features above are enabled by default

* They are implemented using pluggable filter modules on request / response
* You can customize which filters to use via optional params of the send() function
* You can write your own filters

### Advanced: Overriding default filters :rocket:
```javascript
'use strict';

const send = require('@tonybadguy/call-me-maybe');
const jsonBodyFilter = require('@tonybadguy/call-me-maybe/lib/response-filters/json-body');

const request = {
  url: 'https://httpbin.org/get'
};

const requestFilters = []; // don't use any of the default request filters
const responseFilters = [jsonBodyFilter]; // only use the json body filter

send(request, requestFilters, responseFilters).then(response => {
  console.log(response);
});
```

### Advanced: Example custom request filter :rocket::rocket:
```javascript
'use strict';

// a filter that always sets the request body to 'hello world!'
module.exports = {
  filter: (request) => {
    request.body = 'hello world!';
  
    return request;
  }
};
```

### Advanced: Custom response filters are exactly the same :rocket::rocket:
```javascript
'use strict';

// a filter that always sets the response body to 'hello world!'
module.exports = {
  filter: (response) => {
    response.body = 'hello world!';
  
    return request;
  }
};
```
