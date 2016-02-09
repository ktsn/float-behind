'use strict';

const express = require('express');
const slackAdapter = require('../adapters/slack');

const router = express.Router();

router.get('/slack', function (req, res) {
  if (req.session.userId) {
    return res.redirect('/');
  }
  res.redirect(slackAdapter.getOAuthUrl());
});

router.get('/slack/callback', function (req, res) {
  slackAdapter
    .fetchTokenByParam(req.query)
    .then((token) => slackAdapter.saveSlackUser(token))
    .then((user) => {
      req.session.regenerate(function () {
        req.session.userId = user.get('id');
        res.redirect('/');
      });
    });
});

module.exports = router;
