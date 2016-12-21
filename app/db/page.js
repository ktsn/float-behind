'use strict'

const _ = require('lodash')
const Promise = require('bluebird')
const db = require('./index')

const Page = db.bookshelf.Model.extend({
  tableName: 'pages',
  hidden: ['group_id', 'user_id'],

  user () {
    return this.belongsTo(db.models.User)
  },
  floatingUsers () {
    return this.belongsToMany(db.models.User, 'float_pages')
  },
  group () {
    return this.belongsTo(db.models.Group)
  },

  floatFor(users) {
    const promises = _(users.toArray())
      .map((user) => user.related('floatPages').attach(this))
      .value()

    return Promise.all(promises)
  }
})

module.exports = db.models.Page = Page
