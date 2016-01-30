"use strict";

const _ = require("lodash");
const User = require("../db/user");

const ctrl = {};

ctrl.getPages = function (req, res) {
  const sinceId = Number(req.query.sinceId);
  const userId = req.session.userId;

  User.where("id", userId)
    .fetch({
      withRelated: {
        floatPages: (qb) => qb.where("id", ">=", sinceId),
        "floatPages.user": (qb) => qb.column("id", "name", "icon_url")
      }
    })
    .then((user) => {
      const floatPages = user.related("floatPages");
      res.json({ result: floatPages });
    });
};

module.exports = ctrl;
