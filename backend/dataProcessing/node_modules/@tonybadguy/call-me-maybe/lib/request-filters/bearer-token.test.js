'use strict';

const _test = require('tap').test;
const _bearerToken = require('./bearer-token');

_test('Sets Authorization header', assert =>{
  const result = _bearerToken.filter({
    bearerToken: 'my token'
  });
  
  assert.equals(result.headers.Authorization, 'Bearer my token');
  assert.end();
});

_test('request.bearerToken unchanged', assert =>{
  const request = {
    bearerToken: 'my token'
  };
  
  const result = _bearerToken.filter(request);
  
  assert.equals(request.bearerToken, 'my token');
  assert.end();
});

_test('Overrides existing Authorization header', assert =>{
  const result = _bearerToken.filter({
    bearerToken: 'my token',
    headers: {
      Authorization: 'original'
    }
  });
  
  assert.equals(result.headers.Authorization, 'Bearer my token');
  assert.end();
});

_test('Overrides existing Authorization header case insensitive', assert =>{
  const result = _bearerToken.filter({
    bearerToken: 'my token',
    headers: {
      authorization: 'original'
    }
  });
  
  assert.equals(result.headers.Authorization, 'Bearer my token');
  assert.equals(result.headers.authorization, undefined);
  assert.end();
});