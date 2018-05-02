'use strict';
const http = require('http');
const https = require('https');
const url = require('url');
const typedError = require('error/typed');

const unknownProtocolErrorType = 'request-function/unknown-protocol';

const unknownProtocolError = typedError({
  type: unknownProtocolErrorType,
  message: "Unknown protocol '{protocol}'"
});

const fromProtocol = (protocol) => {
  switch(protocol){
    case 'http:':
      return http.request;
    case 'https:':
      return https.request;
    default:
      throw unknownProtocolError({
        protocol: protocol
      });
  }
};

const fromUrl = (urlString) => {
  const parsedUrl = url.parse(urlString);
  return fromProtocol(parsedUrl.protocol);
};

module.exports = {
  fromProtocol: fromProtocol,
  fromUrl: fromUrl,
  unknownProtocolErrorType: unknownProtocolErrorType
};