'use strict';

const express = require('express');
const User = require('../db/user');
const shouldUserLogin = require('../middlewares/shouldUserLogin');

const router = express.Router();

router.use(shouldUserLogin);

router.get('/me', function (req, res) {
  User.where('id', req.session.userId)
    .fetch()
    .then((user) => {
      res.json({ result: user });
    });
});

module.exports = router;
