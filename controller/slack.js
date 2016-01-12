var Page = require("../db/page");
var moment = require("moment");
var slackController = {};
var slackAdapter = require("../adapters/slack");

slackController.urlFromSlack = function (req, res) {

  slackAdapter.createPageByCommand(req.body)
    .then((page) => {
      if (!page) return res.status(400).json({message: "URLを貼れ！"});

      res.status(200).json(page);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({error: err});
    });
};

slackController.requestOAuth = function (req, res) {
  res.redirect(slackAdapter.getOAuthUrl());
};

slackController.callbackOAuth = function (req, res) {
  slackAdapter
    .fetchTokenByParam(req.query)
    .then((token) => {
      // TODO: store token
      console.log(token);
      res.send("OK");
    });
};

module.exports = slackController;
