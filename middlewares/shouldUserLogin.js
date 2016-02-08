'use strict';

module.exports = function (req, res, next) {
  if (!req.session.userId) {
    res.status(401)
      .json({ message: 'Login is required' });
  } else {
    next();
  }
};
