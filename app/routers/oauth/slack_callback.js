'use strict';

const slackAdapter = require('../../adapters/slack');

module.exports = function (req, res) {
  slackAdapter
    .fetchTokenByParam(req.query)
    .then((token) => slackAdapter.saveSlackUser(token))
    .then((user) => {
      req.session.regenerate(function () {
        req.session.userId = user.get('id');
        res.redirect('/');
      });
    });
};
