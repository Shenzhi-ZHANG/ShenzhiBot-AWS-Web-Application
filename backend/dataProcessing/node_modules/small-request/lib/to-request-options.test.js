'use strict';

const _toRequestOptions = require('./to-request-options');
const _test = require('tap').test;

_test('Maps headers', assert => {
  
  assert.plan(1);
  
  const headers = {
    'Content-Type': 'mock headers'
  };
  
  const result = _toRequestOptions({
    url: "http://localhost",
    headers: headers
  });
  
  assert.equal(result.headers, headers);
});

_test('Maps method', assert => {
  
  assert.plan(1);
  
  const method = 'POST';
  
  const result = _toRequestOptions({
    url: "http://localhost",
    method: method
  });
  
  assert.equal(result.method, method);
});

_test('Method default is GET', assert => {
  
  assert.plan(1);

  const result = _toRequestOptions({
    url: "http://localhost"
  });
  
  assert.equal(result.method, 'GET');
});

_test('Options from url is populated', assert => {
  
  assert.plan(3);

  const result = _toRequestOptions({
    url: "http://localhost/foo"
  });
  
  assert.equal(result.protocol, 'http:');
  assert.equal(result.host, 'localhost');
  assert.equal(result.path, '/foo');
  
});