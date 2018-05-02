'use strict';

const _caseless = require('caseless');

const setHeader = (request, headerName, headerValue) => {
  if(!request.headers){
    request.headers = {};
  }

  const headers = _caseless(request.headers);
  headers.set(headerName, headerValue);
  if(headers.has(headerName) !== headerName){
    headers.swap(headerName);
  }
};

const setHeaderIfNotExist = (request, headerName, headerValue) => {
  if(!request.headers || !_caseless(request.headers).has(headerName)){
    setHeader(request, headerName, headerValue);
  }
};

const setContentTypeIfNotExist = (request, contentType) =>{
  return setHeaderIfNotExist(request, 'Content-Type', contentType);
};

module.exports = {
  setHeader: setHeader,
  setHeaderIfNotExist: setHeaderIfNotExist,
  setContentTypeIfNotExist: setContentTypeIfNotExist
};