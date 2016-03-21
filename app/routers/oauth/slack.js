'use strict';

const slackAdapter = require('../../adapters/slack');

module.exports = function (req, res) {
  if (req.session.userId) {
    return res.redirect('/');
  }
  res.redirect(slackAdapter.getOAuthUrl());
};
