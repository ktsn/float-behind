"use strict";

const db = require("./index");

const Group = db.bookshelf.Model.extend({
  tableName: "groups",
  users: function () {
    return this.belongsToMany(db.models.User);
  },
  pages: function () {
    return this.hasMany(db.models.Page);
  }
});

module.exports = db.models.Group = Group;
