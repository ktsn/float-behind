"use strict";

const _ = require("lodash");
const Promise = require("bluebird");
const db = require("./index");

const Page = db.bookshelf.Model.extend({
  tableName: "pages",
  hidden: ["group_id", "user_id"],

  user: function () {
    return this.belongsTo(db.models.User);
  },
  floatingUsers: function () {
    return this.belongsToMany(db.models.User, "float_pages");
  },
  group: function () {
    return this.belongsTo(db.models.Group);
  },

  floatFor: function(users) {
    const promises = _(users.toArray())
      .map((user) => user.related("floatPages").attach(this))
      .value();

    return Promise.all(promises);
  }
});

module.exports = db.models.Page = Page;
