'use strict';

const _test = require('tap').test;
const _urlencodedBody = require('./urlencoded-body');

_test('Body replaced with urlencodedBody if exists', assert =>{
  assert.plan(1);
  const request = {
    body: 'nonsense',
    urlencodedBody:{
      greeting:'oh hai'
    }
  };
  
  const result = _urlencodedBody.filter(request);
  
  assert.equals(result.body, 'greeting=oh%20hai');
});

_test('Body and headers unchanged if jsonBody not set', assert =>{
  assert.plan(2);
  const request = {
    body: 'expected'
  };
  
  const result = _urlencodedBody.filter(request);
  
  assert.equals(result.body, 'expected');
  assert.equals(result.headers, undefined);
});

_test('Sets content-type header', assert =>{
  assert.plan(1);
  const request = {
    urlencodedBody:{}
  };
  
  const result = _urlencodedBody.filter(request);
  
  assert.equals(result.headers['Content-Type'], 'application/x-www-form-urlencoded');
});
