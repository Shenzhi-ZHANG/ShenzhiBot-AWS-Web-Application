'use strict';

const _caseless = require('caseless');
const _headers = require('../headers');

const contentType = 'application/json';

const filter = (request) => {
  if(request.jsonBody){
    request.body = JSON.stringify(request.jsonBody);
    
    _headers.setContentTypeIfNotExist(request, contentType);
  }
  
  return request;
};

module.exports = {
  filter: filter
};