'use strict';

const _ = require('lodash');

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
    next(req.validationErrors());
  };
};
