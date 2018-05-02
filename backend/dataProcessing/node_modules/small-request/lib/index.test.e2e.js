const _request = require('./index');
const _test = require('tap').test;

_test('Basic GET succeeds', assert => {
  
  assert.plan(2);
  const url = 'https://httpbin.org/get';
  
  _request.send({
    url: url
  }).then(response => {
    const json = JSON.parse(response.body);
    
    assert.equal(response.statusCode, 200);
    assert.equal(json.url, url);
    assert.end();
  });
});

_test('Basic POST succeeds', assert => {
  
  assert.plan(2);
  const url = 'https://httpbin.org/post';
  
  _request.send({
    url: url,
    method: 'POST'
  }).then(response => {
    const json = JSON.parse(response.body);
    
    assert.equal(response.statusCode, 200);
    assert.equal(json.url, url);
    assert.end();
  });
});

_test('Headers are sent', assert => {
  
  assert.plan(1);
  const url = 'https://httpbin.org/headers';
  
  const headerName = 'X-Test-Header';
  const headerValue = 'test header value';
  
  _request.send({
    url: url,
    headers: {
      [headerName]: headerValue
    }
  }).then(response => {
    const json = JSON.parse(response.body);
    
    assert.equal(json.headers[headerName], headerValue);
    assert.end();
  });
});

_test('Resolve promise even when server responds with error status code', assert =>{
  assert.plan(2);
  
  const url = 'https://httpbin.org/status/418';
  
  _request.send({
    url: url
  }).then(response => {
    assert.equal(response.statusCode, 418);
    assert.ok(response.body.includes('teapot'));
  }).catch(error => {
    assert.fail();
  });
});

_test('Connection error rejects promise', assert =>{
  assert.plan(1);
  
  const url = 'https://localhost:9999';
  
  _request.send({
    url: url
  }).then(response => {
    assert.fail();
  }).catch(error => {
    assert.equal(error.code, 'ECONNREFUSED');
  });
});