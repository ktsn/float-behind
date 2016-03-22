'use strict';

const express = require('express');
const getUrls = require('get-urls');
const User = require('../db/user');
const shouldUserLogin = require('../middlewares/shouldUserLogin');
const slashCommandResponse = require('../middlewares/slashCommandResponse');
const slackAdapter = require('../adapters/slack');
const {snakeToCamel} = require('../utils/transform');
const {validator} = require('../validator');

const router = express.Router();

router.post('/slack', [
  function (req, res, next) {
    req.body = snakeToCamel(req.body);
    req.body.text = getUrls(req.body.text, { stripWWW: false })[0];
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
]);

router.use(shouldUserLogin);

router.get('/', [
  validator({
    query: {
      sinceId: { optional: true, isInt: { errorMessage: 'sinceId should be integer' }}
    }
  }),
  function (req, res) {
    const sinceId = Number(req.query.sinceId) || 0;
    const userId = req.session.userId;

    User.where('id', userId)
      .fetch({
        withRelated: {
          floatPages: (qb) => qb.where('id', '>=', sinceId),
          'floatPages.user': (qb) => qb.column('id', 'name', 'icon_url')
        }
      })
      .then((user) => {
        const floatPages = user.related('floatPages');
        res.json({ result: floatPages });
      });
  }
]);

router.delete('/:id', [
  validator({
    params: {
      id: { isInt: { errorMessage: 'id should be integer' }}
    }
  }),
  function (req, res) {
    const pageId = req.params.id;
    const userId = req.session.userId;

    User.where('id', userId)
      .fetch()
      .then((user) => {
        const floatPages = user.related('floatPages');
        return floatPages.detach(pageId);
      })
      .then(() => {
        res.json({ result: {} });
      });
  }
]);

module.exports = router;
