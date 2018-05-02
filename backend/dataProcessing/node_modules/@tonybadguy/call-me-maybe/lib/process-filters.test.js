'use strict';

const _test = require('tap').test;
const _processFilters = require('./process-filters');

_test('Calls all filters in order', assert =>{
  
  assert.plan(2);
  const expectedContext = {};
  
  const filter1 = {
    filter: (context) => {
      assert.equal(context, expectedContext);
      return context;
    }
  };
  
  const filter2 = {
    filter: (context) => {
      assert.equal(context, expectedContext);
      assert.end();
      return context;
    }
  };
  
  _processFilters(expectedContext, [filter1, filter2]);
  
});