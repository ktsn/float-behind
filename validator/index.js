'use strict';

const _ = require('lodash');
const {createErrorResponse} = require('../utils/error');

/**
 * Receive validation config and returns middleware for validation
 * validation := {
 *   body: {...},
 *   query: {...},
 *   params: {...},
 *   headers: {...}
 * }
 */
exports.validator = function(validation) {
  return function (req, res, next) {
    _.forEach(validation, (val, key) => {
      req[`check${_.capitalize(key)}`](validation[key]);
    });

    const error = adjustError(req.validationErrors());

    next(createErrorResponse(error, 400));
  };
};

function adjustError(errors) {
  if (!errors) return null;

  const getMessage = (obj) => obj.message;

  return {
    message: _.map(errors, getMessage).join('\n'),
    details: errors
  };
}

exports.errorFormatter = function(param, message, value) {
  return { param, message, value };
};

exports.customValidators = {
  isPageURL: function(value) {
    return /^https?:\/\//i.test(value);
  }
};
