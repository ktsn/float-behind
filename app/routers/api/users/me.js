'use strict';

const User = require('../../../db/user');

module.exports = function (req, res) {
  User.where('id', req.session.userId)
    .fetch()
    .then((user) => {
      res.json({ result: user });
    });
};
