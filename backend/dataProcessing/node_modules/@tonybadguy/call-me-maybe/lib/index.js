'use strict';

const _smallRequest = require('small-request');
const _defaultRequestFilters = require('./default-request-filters');
const _defaultResponseFilters = require('./default-response-filters');
const _processFilters = require('./process-filters');

const send = (request, requestFilters, responseFilters) => {
  
  if(!requestFilters){
    requestFilters = _defaultRequestFilters();
  }
  
  if(!responseFilters){
    responseFilters = _defaultResponseFilters();
  }
  
  return _smallRequest.send(_processFilters(request, requestFilters)).then(response => {
    return _processFilters(response, responseFilters);
  });
};

module.exports = send;
