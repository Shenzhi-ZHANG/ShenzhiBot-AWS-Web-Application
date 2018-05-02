'use strict';
const requestFunction = require('./index');
const test = require('tap').test;

test('http url returns correct request', (assert => {
  assert.plan(1);
  
  var request = requestFunction.fromUrl('http://localhost');
  assert.equal(request, require('http').request);

}));

test('https url returns correct request', (assert => {
  assert.plan(1);
  
  var request = requestFunction.fromUrl('https://localhost');
  assert.equal(request, require('https').request);

}));

test('unknown url throws correct error', (assert) => {
  assert.plan(2);
  
  const requestFunction = require('./index');

  try{
    requestFunction.fromUrl('telnet://localhost');
  }
  catch(e){
    assert.equal(e.type, requestFunction.unknownProtocolErrorType);
    assert.equal(e.message, "Unknown protocol 'telnet:'");
  }
});

test('http protocol returns correct request', (assert => {
  assert.plan(1);
  
  var request = requestFunction.fromProtocol('http:');
  assert.equal(request, require('http').request);

}));

test('https protocol returns correct request', (assert => {
  assert.plan(1);
  
  var request = requestFunction.fromProtocol('https:');
  assert.equal(request, require('https').request);

}));

test('unknown protocol throws correct error', (assert) => {
  assert.plan(2);
  
  const requestFunction = require('./index');

  try{
    requestFunction.fromProtocol('telnet:');
  }
  catch(e){
    assert.equal(e.type, requestFunction.unknownProtocolErrorType);
    assert.equal(e.message, "Unknown protocol 'telnet:'");
  }
});

test('unknownProtocolErrorType is correct', (assert) => {
  assert.plan(1);
  
  assert.equal('request-function/unknown-protocol', requestFunction.unknownProtocolErrorType);
});