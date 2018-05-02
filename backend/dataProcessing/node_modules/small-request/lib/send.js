'use strict';

const _requestFunction = require('request-function');
const _toRequestOptions = require('./to-request-options');
const _responseHandler = require('./response-handler');

const send = (requestModel) => {
  return new Promise((resolve, reject) => {
    try{
      const options = _toRequestOptions(requestModel);
      const request = _requestFunction.fromProtocol(options.protocol);

      const clientRequest = request(options, (resp) => _responseHandler(resp, resolve, reject));

      clientRequest.on('error', (e) => {
        reject(e);
      });

      if(requestModel.body){
        clientRequest.write(requestModel.body);
      }
      
      clientRequest.end();    
    } catch(e){
      reject(e);
    }
  });
};

module.exports = send;