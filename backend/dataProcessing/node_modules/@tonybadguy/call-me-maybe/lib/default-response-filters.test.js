'use strict';

const _test = require('tap').test;
const _defaultResponseFilters = require('./default-response-filters');
const _unhandledStatus = require('./response-filters/unhandled-status');
const _jsonBody = require('./response-filters/json-body');

_test('Returns correct filters', assert =>{
  const defaultResponseFilters = _defaultResponseFilters();
  
  const expected = [_unhandledStatus, _jsonBody];
  
  assert.equal(defaultResponseFilters.length, expected.length);
  for(let i=0; i<expected.length; i++){
    assert.equal(defaultResponseFilters[i], expected[i]);
  }
  assert.end();
});