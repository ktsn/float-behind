"use strict";

const db = require("./index");

const Page = db.bookshelf.Model.extend({
  tableName: "pages",
  user: function () {
    return this.belongsTo(User);
  },
  floatingUsers: function () {
    return this.belongsToMany(db.models.User, "float_pages");
  },
  group: function () {
    return this.belongsTo(db.models.Group);
  }
});

module.exports = db.models.Page = Page;
