'use strict';
const _TypedError = require('error/typed');

const error = _TypedError({
  type: 'rest-call.response-filters.unhandled-status',
  message: 'Server returned status code {statusCode}',
  statusCode: null,
  response: null
});

const filter = (response) => {
  if(response.statusCode < 200 || response.statusCode >= 300){
    throw error({
      statusCode: response.statusCode,
      response: response
    });
  }
  return response;
};

module.exports = {
  filter: filter,
  unhandledStatusError: error
};