'use strict';

const _send = require('./index');
const _test = require('tap').test;

_test('Basic GET succeeds', assert => {
  const url = 'https://httpbin.org/get';
  
  _send({
    url: url
  }).then(response => {
    assert.equal(response.statusCode, 200);
    assert.equal(response.jsonBody.url, url);
    assert.end();
  });
});

_test('Basic GET with formatted url', assert => {
  const url = 'https://httpbin.org/{foo}';
  
  _send({
    url: url,
    urlParams:{
      foo:'get'
    }
  }).then(response => {
    assert.equal(response.statusCode, 200);
    assert.equal(response.jsonBody.url, 'https://httpbin.org/get');
    assert.end();
  });
});

_test('Basic GET with query object', assert => {
  const url = 'https://httpbin.org/get';
  
  _send({
    url: url,
    query:{
      foo:'bar'
    }
  }).then(response => {
    assert.equal(response.statusCode, 200);
    assert.equal(response.jsonBody.url, 'https://httpbin.org/get?foo=bar');
    assert.end();
  });
});

_test('Basic POST', assert => {
  
  const url = 'https://httpbin.org/post';
  
  _send({
    url: url,
    method: 'POST'
  }).then(response => {
    assert.equal(response.statusCode, 200);
    assert.equal(response.jsonBody.url, url);
    assert.end();
  });
});

_test('Basic POST with body', assert => {
  
  const url = 'https://httpbin.org/post';
  
  _send({
    url: url,
    method: 'POST',
    body: 'my data'
  }).then(response => {
    assert.equal(response.statusCode, 200);
    assert.equal(response.jsonBody.data, 'my data');
    assert.end();
  });
});

_test('POST json body', assert => {
  
  const url = 'https://httpbin.org/post';
  
  _send({
    url: url,
    method: 'POST',
    jsonBody:{
      foo:'bar'
    }
  }).then(response => {
    assert.equal(response.statusCode, 200);
    assert.equal(response.jsonBody.json.foo, 'bar');
    assert.end();
  });
});

_test('POST urlencoded body', assert => {
  
  assert.plan(2);
  const url = 'https://httpbin.org/post';
  
  _send({
    url: url,
    method: 'POST',
    urlencodedBody:{
      foo:'bar'
    }
  }).then(response => {
    assert.equal(response.statusCode, 200);
    assert.equal(response.jsonBody.form.foo, 'bar');
  });
});

_test('Headers are sent', assert => {
  
  const url = 'https://httpbin.org/headers';
  
  const headerName = 'X-Test-Header';
  const headerValue = 'test header value';
  
  _send({
    url: url,
    headers: {
      [headerName]: headerValue
    }
  }).then(response => {
    assert.equal(response.jsonBody.headers[headerName], headerValue);
    assert.end();
  });
});

_test('Reject promise when server responds with status code >= 300', assert =>{
  const url = 'https://httpbin.org/status/300';
  
  _send({
    url: url
  }).then(response => {
    assert.fail();
  }).catch(error => {
    assert.equal(error.response.statusCode, 300);
    assert.end();
  });
});

_test('Reject promise when server responds with status code < 200', assert =>{
  const url = 'https://httpbin.org/status/199';
  
  _send({
    url: url
  }).then(response => {
    assert.fail();
  }).catch(error => {
    assert.equal(error.response.statusCode, 199);
    assert.end();
  });
});

_test('Connection error rejects promise', assert =>{
  const url = 'https://localhost:9999';
  
  _send({
    url: url
  }).then(response => {
    assert.fail();
  }).catch(error => {
    assert.equal(error.code, 'ECONNREFUSED');
    assert.end();
  });
});