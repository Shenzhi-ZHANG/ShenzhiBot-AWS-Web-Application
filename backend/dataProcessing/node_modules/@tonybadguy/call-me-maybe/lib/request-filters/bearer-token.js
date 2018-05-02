'use strict';

const _headers = require('../headers');

const filter = (request) => {
  
  if(request.bearerToken){
    _headers.setHeader(request, 'Authorization', 'Bearer ' + request.bearerToken);
  }
  
  return request;
};

module.exports = {
  filter: filter
};