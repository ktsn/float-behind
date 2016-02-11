'use strict';

// Replace the stock res.json() method with one that also attaches a code field that reflects the
// HTTP status code of the response.

module.exports = function (req, res, next) {
  res._json = res.json;
  res.json = function (obj) {
    if (obj) {
      obj.status = res.statusCode;
    } else {
      obj = {
        status: res.statusCode
      };
    }
    res._json(obj);
  };
  next();
};
