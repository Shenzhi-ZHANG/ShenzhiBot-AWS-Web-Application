'use strict';

const _test = require('tap').test;
const _defaultRequestFilters = require('./default-request-filters');
const _defaultOptions = require('./request-filters/default-options');
const _urlParams = require('./request-filters/url-params');
const _query = require('./request-filters/query');
const _jsonBody = require('./request-filters/json-body');
const _urlencodedBody = require('./request-filters/urlencoded-body');
const _bearerToken = require('./request-filters/bearer-token');

_test('Returns correct filters', assert =>{
  const defaultRequestFilters = _defaultRequestFilters();
  
  const expected = [_defaultOptions, _bearerToken, _urlParams, _query, _urlencodedBody, _jsonBody];
  
  assert.equal(defaultRequestFilters.length, expected.length);
  for(let i=0; i<expected.length; i++){
    assert.equal(defaultRequestFilters[i], expected[i]);
  }
  assert.end();
});