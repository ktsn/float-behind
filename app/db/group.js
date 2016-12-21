'use strict'

const db = require('./index')

const Group = db.bookshelf.Model.extend({
  tableName: 'groups',
  hidden: ['slack_team_id'],

  users () {
    return this.belongsToMany(db.models.User)
  },
  pages () {
    return this.hasMany(db.models.Page)
  }
})

module.exports = db.models.Group = Group
