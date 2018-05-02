'use strict';

const _test = require('tap').test;
const _jsonBody = require('./json-body');

_test('Parse object', assert =>{
  assert.plan(1);
  
  const result = _jsonBody.filter({
    body:'{"foo":"bar"}'
  });
  
  assert.equals(result.jsonBody.foo, 'bar');
});

_test('Parse array', assert =>{
  assert.plan(1);
  
  const result = _jsonBody.filter({
    body:'[123]'
  });
  
  assert.equals(result.jsonBody[0], 123);
});

_test('Parse number', assert =>{
  assert.plan(1);
  
  const result = _jsonBody.filter({
    body:'123'
  });
  
  assert.equals(result.jsonBody, 123);
});

_test('Does not parse standalone string', assert =>{
  assert.plan(1);
  
  const result = _jsonBody.filter({
    body:'abc'
  });
  
  assert.equals(result.jsonBody, undefined);
});

_test('Parse exceptions are ignored', assert =>{
  assert.plan(1);
  
  const result = _jsonBody.filter({
    body:'{1a]'
  });
  
  assert.equals(result.jsonBody, undefined);
});
