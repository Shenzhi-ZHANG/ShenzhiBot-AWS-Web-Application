'use strict';

const responseHandler = (response, resolve, reject) => {
  let data = '';

  response.on('data', (d) => {
    data += d;
  });

  response.on('end', (d) => {
    resolve({
      statusCode: response.statusCode,
      headers: response.headers,
      body: data
    });
  });

  response.on('error', (e) => {
    reject(e);
  });
};

module.exports = responseHandler;