'use strict';

const _stringTemplate = require('string-template');
const _url = require('url');

const filter = (request) => {
  if(request.urlParams){
    const encodedParams = {};
    
    for(let key in request.urlParams){
      encodedParams[key] = encodeURIComponent(request.urlParams[key]);
    }
    
    request.url = _stringTemplate(request.url, encodedParams);
  }
  
  request.url = _url.format(_url.parse(request.url));
  
  return request;
};

module.exports = {
  filter: filter
};