'use strict'

const User = require('../../../db/user')
const { validator } = require('../../../validator')

module.exports = [
  validator({
    query: {
      sinceId: { optional: true, isInt: { errorMessage: 'sinceId should be integer' }}
    }
  }),
  function (req, res) {
    const sinceId = Number(req.query.sinceId) || 0
    const userId = req.session.userId

    User.where('id', userId)
      .fetch({
        withRelated: {
          floatPages: (qb) => qb.where('id', '>=', sinceId),
          'floatPages.user': (qb) => qb.column('id', 'name', 'icon_url')
        }
      })
      .then((user) => {
        const floatPages = user.related('floatPages')
        res.json({ result: floatPages })
      })
  }
]
