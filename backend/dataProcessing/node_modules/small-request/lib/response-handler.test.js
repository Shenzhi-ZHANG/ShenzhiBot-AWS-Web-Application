'use strict';

const _responseHandler = require('./response-handler');
const _test = require('tap').test;

_test('End event resolves correct statusCode', assert => {
  
  assert.plan(1);
  
  const statusCode = 200;
  
  const mockResponse = {
    handlers: {},
    on: (event, handler) => {
      mockResponse.handlers[event] = handler;
    },
    statusCode: statusCode
  };
  
  const mockResolve = (responseModel) => {
    assert.equal(responseModel.statusCode, statusCode);
    assert.end();
  };
  
  const responseHandler = _responseHandler(mockResponse, mockResolve, null);
  mockResponse.handlers.end();
});

_test('End event resolves correct headers', assert => {
  
  assert.plan(1);
  
  const headers = {
    'Content-Type':'mocked header'
  };
  
  const mockResponse = {
    handlers: {},
    on: (event, handler) => {
      mockResponse.handlers[event] = handler;
    },
    headers: headers
  };
  
  const mockResolve = (responseModel) => {
    assert.equal(responseModel.headers, headers);
    assert.end();
  };

  const responseHandler = _responseHandler(mockResponse, mockResolve, null);
  mockResponse.handlers.end();
});

_test('Data and end events resolve correct body', assert => {
  
  assert.plan(1);
  
  const mockResponse = {
    handlers: {},
    on: (event, handler) => {
      mockResponse.handlers[event] = handler;
    }
  };
  
  const mockResolve = (responseModel) => {
    assert.equal(responseModel.body, 'abc');
    assert.end();
  };

  const responseHandler = _responseHandler(mockResponse, mockResolve, null);
  mockResponse.handlers.data('a');
  mockResponse.handlers.data('b');
  mockResponse.handlers.data('c');
  mockResponse.handlers.end('foo');
});

_test('Error event rejects with correct error', assert => {
  
  assert.plan(1);
  
  const error = "mock error";
  
  const mockResponse = {
    handlers: {},
    on: (event, handler) => {
      mockResponse.handlers[event] = handler;
    }
  };

  const mockReject = (e) => {
    assert.equal(e, error);
    assert.end();
  };
  
  const responseHandler = _responseHandler(mockResponse, null, mockReject);
  mockResponse.handlers.error(error);
});