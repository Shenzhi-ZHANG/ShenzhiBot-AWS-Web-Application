'use strict';
const _unhandledStatusFilter = require('./response-filters/unhandled-status');
const _jsonBodyFilter = require('./response-filters/json-body');

const defaultFilters = () => [
  _unhandledStatusFilter,
  _jsonBodyFilter
];

module.exports = defaultFilters;