'use strict';

const _test = require('tap').test;
const _urlParams = require('./url-params');

_test('Noop on basic Url', assert =>{
  const result = _urlParams.filter({
    url: 'https://www.google.com'
  });
  
  assert.equals(result.url, 'https://www.google.com/');
  assert.end();
});

_test('UrlParams update request url', assert => {
  const result = _urlParams.filter({
    url: 'https://www.google.com/{resource}/{id}',
    urlParams: {
      resource: 'someResource',
      id: '123'
    }
  });
  
  assert.equals(result.url, 'https://www.google.com/someResource/123');
  assert.end();
});

_test('UrlParams url encode urlParams', assert => {
  const result = _urlParams.filter({
    url: 'https://www.google.com/{resource}',
    urlParams: {
      resource: 'some resource'
    }
  });
  
  assert.equals(result.url, 'https://www.google.com/some%20resource');
  assert.end();
});

_test('Original url gets url encoded', assert => {
  const result = _urlParams.filter({
    url: 'https://www.google.com/foo bar'
  });
  
  assert.equals(result.url, 'https://www.google.com/foo%20bar');
  assert.end();
});

_test('UrlParams unchanged', assert => {
  const request = {
    url: 'https://www.google.com/{resource}',
    urlParams: {
      resource: 'oh hai'
    }
  };
  
  const result = _urlParams.filter(request);
  
  assert.equals(request.urlParams.resource, 'oh hai');
  assert.end();
});