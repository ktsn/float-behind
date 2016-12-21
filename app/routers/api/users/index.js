'use strict'

const express = require('express')
const shouldUserLogin = require('../../../middlewares/shouldUserLogin')

const router = express.Router()

router.use(shouldUserLogin)

router.get('/me', require('./me'))

module.exports = router
