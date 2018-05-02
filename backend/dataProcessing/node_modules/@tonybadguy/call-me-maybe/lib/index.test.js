'use strict';

const _test = require('tap').test;
const _proxyquire = require('proxyquire');
const _sinon = require('sinon');

_test('Default request filters if not specified', assert => {
  const defaultRequestFilters = _sinon.spy();
  
  const index = _proxyquire('./index', {
    './default-request-filters': defaultRequestFilters,
    './process-filters': () =>{}
  });
  
  index({});
  
  assert.true(defaultRequestFilters.calledOnce);
  assert.end();
});

_test('Default request filters not called if specified', assert => {
  
  const defaultRequestFilters = _sinon.spy();

  const index = _proxyquire('./index', {
    './default-request-filters': defaultRequestFilters,
    './process-filters': () =>{}
  });
  
  index({}, {});
  
  assert.false(defaultRequestFilters.called);
  assert.end();
});

_test('Default response filters if not specified', assert => {
  
  const defaultResponseFilters = _sinon.spy();

  const index = _proxyquire('./index', {
    './default-response-filters': defaultResponseFilters,
    './process-filters': () =>{}
  });
  
  index({});
  
  assert.true(defaultResponseFilters.calledOnce);
  assert.end();
});

_test('Default response filters not called if specified', assert => {
  
  const defaultResponseFilters = _sinon.spy();

  const index = _proxyquire('./index', {
    './default-response-filters': defaultResponseFilters,
    './process-filters': () =>{}
  });
  
  index({}, null, {});
  
  assert.false(defaultResponseFilters.called);
  assert.end();
});

_test('Calls process filters for request', assert => {
  const processFilters = _sinon.spy();
  
  const request = {};
  const requestFilters = ['request filters'];
  
  const index = _proxyquire('./index', {
    './process-filters': processFilters
    });
  
  index(request, requestFilters);
  
  assert.true(processFilters.withArgs(request, requestFilters).calledOnce);
  assert.end();
});

_test('Calls process filters for response', assert => {
  
  const processFilters = _sinon.spy();
  
  const response = {};
  const responseFilters = ['response filters'];
  
  const send = _proxyquire('./index', {
    'small-request':{
      send: () => {
        return new Promise((resolve, reject) => {
          resolve(response);
        });
      }
    },
    './process-filters': processFilters
  });
  
  send({}, null, responseFilters).then(result =>{
    assert.true(processFilters.withArgs(response, responseFilters).called);
    assert.end();
  });
  
});