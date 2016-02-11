'use strict';

const _ = require('lodash');
const util = require('util')

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

    var errors = req.validationErrors();
    if (errors) {
      res.send(util.inspect(errors), 400);
      return;
    } else {
      next();
    }
  };
};
