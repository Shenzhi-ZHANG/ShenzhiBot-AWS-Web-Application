'use strict';

const _test = require('tap').test;
const _defaultOptions = require('./default-options');

_test('GET method by default', assert =>{
  const result = _defaultOptions.filter({});
  
  assert.equals(result.method, 'GET');
  assert.end();
});

_test('Defaults do not override setting', assert =>{
  const result = _defaultOptions.filter({
    method: 'POST'
  });
  
  assert.equals(result.method, 'POST');
  assert.end();
});