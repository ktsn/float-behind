'use strict'

const User = require('../../../db/user')
const { validator } = require('../../../validator')

module.exports = [
  validator({
    params: {
      id: { isInt: { errorMessage: 'id should be integer' }}
    }
  }),
  function (req, res) {
    const pageId = req.params.id
    const userId = req.session.userId

    User.where('id', userId)
      .fetch()
      .then((user) => {
        const floatPages = user.related('floatPages')
        return floatPages.detach(pageId)
      })
      .then(() => {
        res.json({ result: {}})
      })
  }
]
