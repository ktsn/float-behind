'use strict';

const _ = require('lodash');

function camelToSnake(obj) {
  return transformKeys(obj, _.snakeCase);
}

function snakeToCamel(obj) {
  return transformKeys(obj, _.camelCase);
}

function transformKeys(obj, transform) {
  if (obj === null || typeof obj !== 'object') return obj;

  const to = _.isArray(obj) ? [] : {};

  _(obj)
    .keys()
    .forEach((key) => {
      to[transform(key)] = transformKeys(obj[key], transform);
    })
    .commit();

  return to;
}

function paramsToString(params) {
  return _(params)
    .pairs()
    .map((p) => `${p[0]}=${p[1]}`)
    .join('&');
}

exports.camelToSnake = camelToSnake;
exports.snakeToCamel = snakeToCamel;
exports.paramsToString = paramsToString;
