"use strict";

const db = require("./index");

const User = db.bookshelf.Model.extend({
  tableName: "users",
  pages: function () {
    return this.hasMany(db.models.Page);
  },
  floatPages: function () {
    return this.belongsToMany(db.models.Page, "float_pages");
  },
  groups: function() {
    return this.belongsToMany(db.models.Group);
  }
});

module.exports = db.models.User = User;
