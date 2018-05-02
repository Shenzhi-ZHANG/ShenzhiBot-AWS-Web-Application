# request-function

[![npm version](https://badge.fury.io/js/request-function.svg)](https://badge.fury.io/js/request-function) [![Build Status](https://travis-ci.org/tonybadguy/request-function.svg?branch=master)](https://travis-ci.org/tonybadguy/request-function) [![codecov](https://codecov.io/gh/tonybadguy/request-function/branch/master/graph/badge.svg)](https://codecov.io/gh/tonybadguy/request-function) [![bitHound Overall Score](https://www.bithound.io/github/tonybadguy/request-function/badges/score.svg)](https://www.bithound.io/github/tonybadguy/request-function)

This Node.js module contains a simple helper function for retrieving the corresponding http/https request function for a url.

```
var httpRequest = requestFunction('http://www.google.com');
var httpsRequest = requestFunction('https://www.google.com');
```

The Node.js http / https request functions are described here:
* https://nodejs.org/api/http.html#http_http_request_options_callback
* https://nodejs.org/api/https.html#https_https_request_options_callback
