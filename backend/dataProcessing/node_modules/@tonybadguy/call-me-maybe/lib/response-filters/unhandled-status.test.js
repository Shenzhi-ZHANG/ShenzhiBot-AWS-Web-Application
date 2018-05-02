'use strict';

const _test = require('tap').test;
const _unhandledStatus = require('./unhandled-status');

_test('200 status ok', assert => {
  
  assert.plan(1);
  
  _unhandledStatus.filter({
    statusCode: 200
  });
  
  assert.pass();
});

_test('299 status ok', assert => {
  
  assert.plan(1);
  
  _unhandledStatus.filter({
    statusCode: 200
  });
  
  assert.pass();
});

_test('199 status fail', assert => {
  
  assert.plan(1);
  
  try{
    _unhandledStatus.filter({
      statusCode: 199
    });
    assert.fail();
  } catch(e){
    assert.equals(e.type, _unhandledStatus.unhandledStatusError().type);
  }
});

_test('300 status fail', assert => {
  
  assert.plan(1);
  
  try{
    _unhandledStatus.filter({
      statusCode: 300
    });
    assert.fail();
  } catch(e){
    assert.equals(e.type, _unhandledStatus.unhandledStatusError().type);
  }
});