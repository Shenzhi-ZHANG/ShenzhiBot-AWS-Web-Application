'use strict';

const _url = require('url');

const filter = (request) => {
  const url = _url.parse(request.url);
    
  if(request.query){
    url.query = request.query;
  }
  
  request.url = _url.format(url);
  
  return request;
};

module.exports = {
  filter: filter
};