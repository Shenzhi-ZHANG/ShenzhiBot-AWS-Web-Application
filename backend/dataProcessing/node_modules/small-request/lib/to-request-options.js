'use strict';

const _url = require('url');

const toRequestOptions = (requestModel) =>{
  const options = _url.parse(requestModel.url);
  options.headers = requestModel.headers;
  options.method = requestModel.method || 'GET';
  
  return options;
};

module.exports = toRequestOptions;