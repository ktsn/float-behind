'use strict';

const express = require('express');
const User = require('../db/user');
const shouldUserLogin = require('../middlewares/shouldUserLogin');
const slackAdapter = require('../adapters/slack');
const validator = require('../validator');

const router = express.Router();

router.post('/slack', function (req, res) {
  slackAdapter.createPageByCommand(req.body)
    .then((page) => {
      if (!page) return res.status(400).json({message: 'URLを貼れ！'});

      res.status(200).json(page);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({error: err});
    });
});

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
