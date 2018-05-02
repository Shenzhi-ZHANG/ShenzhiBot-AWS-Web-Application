'use strict';

const _defaultOptions = require('./request-filters/default-options');
const _bearerToken = require('./request-filters/bearer-token');
const _urlParams = require('./request-filters/url-params');
const _query = require('./request-filters/query');
const _urlencodedBody = require('./request-filters/urlencoded-body');
const _jsonBody = require('./request-filters/json-body');

const defaultFilters = () => [
  _defaultOptions,
  _bearerToken,
  _urlParams,
  _query,
  _urlencodedBody,
  _jsonBody
];

module.exports = defaultFilters;