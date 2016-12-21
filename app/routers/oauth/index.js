'use strict'

const express = require('express')
const router = express.Router()

router.get('/slack', require('./slack'))
router.get('/slack/callback', require('./slack_callback'))

module.exports = router
