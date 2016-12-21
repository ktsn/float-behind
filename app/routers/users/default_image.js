'use strict'

const path = require('path')

module.exports = function (req, res) {
  const format = req.param.format || 'png'
  res.sendFile(path.resolve(__dirname, `../assets/img-user_default.${format}`))
}
