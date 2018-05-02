'use strict';

const _test = require('tap').test;
const _query = require('./query');

_test('Noop on basic Url', assert =>{
  const result = _query.filter({
    url: 'https://www.google.com'
  });
  
  assert.equals(result.url, 'https://www.google.com/');
  assert.end();
});

_test('Update request url', assert => {
  const result = _query.filter({
    url: 'https://www.google.com',
    query:{
      foo:'oh hai',
      bar:'kthxbai'
    }
  });
  
  assert.equals(result.url, 'https://www.google.com/?foo=oh%20hai&bar=kthxbai');
  assert.end();
});

_test('query unchanged', assert => {
  const query = {
    foo:'oh hai'
  };
  const result = _query.filter({
    url: 'https://www.google.com',
    query: query
  });
  
  assert.equals(query.foo, 'oh hai');
  assert.end();
});