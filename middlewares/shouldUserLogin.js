'use strict';

const createErrorResponse = require('../utils/error').createErrorResponse;

module.exports = function (req, res, next) {
  if (!req.session.userId) {
    next(createErrorResponse('Login is required', 401));
  } else {
    next();
  }
};
