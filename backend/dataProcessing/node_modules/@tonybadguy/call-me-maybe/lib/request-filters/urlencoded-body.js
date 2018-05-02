'use strict';

const _caseless = require('caseless');
const _querystring = require('querystring');
const _headers = require('../headers');

const contentType = 'application/x-www-form-urlencoded';

const filter = (request) => {
  
  if(request.urlencodedBody){
    
    request.body = _querystring.stringify(request.urlencodedBody);
    _headers.setContentTypeIfNotExist(request, contentType);
  }
  
  return request;
};

module.exports = {
  filter: filter
};