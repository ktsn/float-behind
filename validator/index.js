'use strict';

const _ = require('lodash');
const createErrorResponse = require('../utils/error').createErrorResponse;

/**
 * Receive validation config and returns middleware for validation
 * validation := {
 *   body: {...},
 *   query: {...},
 *   params: {...},
 *   headers: {...}
 * }
 */
module.exports = function(validation) {
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
