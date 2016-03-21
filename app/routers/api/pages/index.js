'use strict';

const express = require('express');
const shouldUserLogin = require('../../../middlewares/shouldUserLogin');

const router = express.Router();

router.post('/slack', require('./slack'));

router.use(shouldUserLogin);

router.get('/', require('./get'));
router.delete('/:id', require('./delete'));

module.exports = router;
