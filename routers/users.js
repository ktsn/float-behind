'use strict';

const path = require('path');
const express = require('express');

const router = express.Router();

router.get('/default_image(.:format)', function (req, res) {
  const format = req.param.format || 'png';
  res.sendFile(path.resolve(__dirname, `../assets/img-user_default.${format}`));
});

module.exports = router;
