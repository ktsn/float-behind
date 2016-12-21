'use strict'

const express = require('express')
const router = express.Router()

router.get('/default_image(.:format)', require('./default_image'))

module.exports = router
