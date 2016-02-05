'use strict';

const User = require('../db/user');

const ctrl = {};

ctrl.getPages = function (req, res) {
  const sinceId = Number(req.query.sinceId);
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
};

ctrl.deletePage = function (req, res) {
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
};

module.exports = ctrl;
