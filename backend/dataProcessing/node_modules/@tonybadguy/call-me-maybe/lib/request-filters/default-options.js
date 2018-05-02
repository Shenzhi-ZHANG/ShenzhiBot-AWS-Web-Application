'use strict';

const defaultOptions = () => {
  return {
    method: 'GET'
  };
};

const filter = (request) => {
  return Object.assign(defaultOptions(), request);
};

module.exports = {
  filter: filter
};