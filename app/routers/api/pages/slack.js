'use strict';

const getUrls = require('get-urls');
const slackAdapter = require('../../../adapters/slack');
const {snakeToCamel} = require('../../../utils/transform');
const {validator} = require('../../../validator');
const slashCommandResponse = require('../../../middlewares/slashCommandResponse');

module.exports = [
  function (req, res, next) {
    req.body = snakeToCamel(req.body);
    req.body.text = getUrls(req.body.text, { stripWWW: false, stripFragment: false })[0];
    next();
  },
  validator({
    body: {
      userId:   { notEmpty: true },
      userName: { notEmpty: true },
      teamId:   { notEmpty: true },
      text:     { isPageURL: { errorMessage: 'The text must include a URL' }}
    }
  }),
  function (req, res) {
    slackAdapter.createPageByCommand(req.body)
      .then((page) => {
        res.status(200).json({
          response_type: 'in_channel',
          text: page.get('title')
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({error: err});
      });
  },
  slashCommandResponse
];
