'use strict';

const _test = require('tap').test;
const _jsonBody = require('./json-body');

_test('Body replaced with jsonBody if exists', assert =>{
  const request = {
    body: 'nonsense',
    jsonBody:{
      greeting:'oh hai'
    }
  };
  
  const result = _jsonBody.filter(request);
  
  assert.equals(JSON.parse(result.body).greeting, 'oh hai');
  assert.end();
});

_test('Body and headers unchanged if jsonBody not set', assert =>{
  const request = {
    body: 'expected'
  };
  
  const result = _jsonBody.filter(request);
  
  assert.equals(result.body, 'expected');
  assert.equals(result.headers, undefined);
  assert.end();
});

_test('Sets content-type header', assert =>{
  const request = {
    jsonBody:{}
  };
  
  const result = _jsonBody.filter(request);
  
  assert.equals(result.headers['Content-Type'], 'application/json');
  assert.end();
});
