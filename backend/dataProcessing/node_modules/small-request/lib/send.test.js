'use strict';

const _test = require('tap').test;
const _proxyquire = require('proxyquire');

_test('Body is sent when there is a value', assert => {
  
  assert.plan(1);
  
  const body = 'body data';
  
  const clientRequest = {
    on: (event, handler) => {},
    write: (data) => {
      assert.equal(data, body);
    },
    end: () => {}
  };
  
  const request = (options, resp) => {
    return clientRequest;
  };
  
  const sendMocks = {
    'request-function': {
      fromProtocol: (p) => {
        return request;
      }
    },
    './to-request-options': (requestModel) => {
      return {};
    }
  };
  
  const send = _proxyquire('./send', sendMocks);
  
  send({
    body: body
  });
});

_test('Body is not sent when falsy', assert => {

  const clientRequest = {
    on: (event, handler) => {},
    write: (data) => {
      assert.fail();
    },
    end: () => {}
  };
  
  const request = (options, resp) => {
    return clientRequest;
  };
  
  const sendMocks = {
    'request-function': {
      fromProtocol: (p) => {
        return request;
      }
    },
    './to-request-options': (requestModel) => {
      return {};
    }
  };
  
  const send = _proxyquire('./send', sendMocks);
  send({});
  assert.ok(true);
  assert.end();
});

_test('Sync code exception causes rejection with error', assert => {
  assert.plan(1);
  const mockError = 'mock error';
  
  const sendMocks = {
    './to-request-options': (requestModel) => {
      throw mockError;
    }
  };
  
  const send = _proxyquire('./send', sendMocks);
  send({}).catch((e) => {
    assert.equal(mockError, e);
    assert.end();
  });
});

_test('Request on error event rejects with error', assert => {
  
  const clientRequest = {
    handlers: [],
    on: (event, handler) => {
      clientRequest.handlers[event] = handler;
    },
    write: (data) => {},
    end: () => {}
  };
  
  const request = (options, resp) => {
    return clientRequest;
  };
  
  const sendMocks = {
    'request-function': {
      fromProtocol: (p) => {
        return request;
      }
    },
    './to-request-options': (requestModel) => {
      return {};
    }
  };
  
  const mockError = 'mock error';
  
  const send = _proxyquire('./send', sendMocks);
  
  send({}).catch(e => {
    assert.equal(mockError, e);
    assert.end();
  });
  
  clientRequest.handlers.error(mockError);
});
