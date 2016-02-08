'use strict';

var slackController = {};
var slackAdapter = require('../adapters/slack');

slackController.urlFromSlack = function (req, res) {

  slackAdapter.createPageByCommand(req.body)
    .then((page) => {
      if (!page) return res.status(400).json({message: 'URLを貼れ！'});

      res.status(200).json(page);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({error: err});
    });
};

slackController.requestOAuth = function (req, res) {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.redirect(slackAdapter.getOAuthUrl());
};

slackController.callbackOAuth = function (req, res) {
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

module.exports = slackController;
