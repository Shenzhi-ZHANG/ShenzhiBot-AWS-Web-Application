'use strict';

const _headers = require('./headers');
const _test = require('tap').test;


_test('setHeaderIfNotExist sets header when headers are undefined', assert =>{
  const request = {};
  _headers.setHeaderIfNotExist(request, 'myheader', 'myvalue');

  assert.equals(request.headers.myheader, 'myvalue');
  assert.end();
});

_test('setHeaderIfNotExist sets header when headers are empty', assert =>{
  const request = {
    headers: {}
  };
  _headers.setHeaderIfNotExist(request, 'myheader', 'myvalue');

  assert.equals(request.headers.myheader, 'myvalue');
  assert.end();
});

_test('setHeaderIfNotExist does not set header when header exists', assert =>{
  const request = {
    headers: {
      myheader:'original'
    }
  };
  _headers.setHeaderIfNotExist(request, 'myheader', 'myvalue');

  assert.equals(request.headers.myheader, 'original');
  assert.end();
});

_test('setHeaderIfNotExist does not set header when header with different casing exists', assert =>{
  const request = {
    headers: {
      MyHeader:'original'
    }
  };
  _headers.setHeaderIfNotExist(request, 'myheader', 'myvalue');

  assert.equals(request.headers.MyHeader, 'original');
  assert.equals(request.headers.myheader, undefined);
  assert.end();
});

_test('setContentTypeIfNotExist sets content type', assert =>{

  const request = {};
  _headers.setContentTypeIfNotExist(request, 'myContentType');

  assert.equals(request.headers['Content-Type'], 'myContentType');
  assert.end();
});

_test('setContentTypeIfNotExist does not set header when header exists', assert =>{
  const request = {
    headers: {
      ['content-type']:'original'
    }
  };
  _headers.setContentTypeIfNotExist(request, 'myvalue');

  assert.equals(request.headers['content-type'], 'original');
  assert.equals(request.headers['Content-Type'], undefined);
  assert.end();
});

_test('setHeader sets header when headers are undefined', assert =>{
  const request = {};
  _headers.setHeader(request, 'myheader', 'myvalue');

  assert.equals(request.headers.myheader, 'myvalue');
  assert.end();
});

_test('setHeader sets header when headers are empty', assert =>{
  const request = {
    headers: {}
  };
  _headers.setHeader(request, 'myheader', 'myvalue');

  assert.equals(request.headers.myheader, 'myvalue');
  assert.end();
});

_test('setHeader replaces header when header exists', assert =>{
  const request = {
    headers: {
      myheader:'original'
    }
  };
  _headers.setHeader(request, 'myheader', 'myvalue');

  assert.equals(request.headers.myheader, 'myvalue');
  assert.end();
});

_test('setHeader replaces header when header with different casing exists', assert =>{
  const request = {
    headers: {
      MyHeader:'original'
    }
  };
  _headers.setHeader(request, 'myheader', 'myvalue');

  assert.equals(request.headers.MyHeader, undefined);
  assert.equals(request.headers.myheader, 'myvalue');
  assert.end();
});