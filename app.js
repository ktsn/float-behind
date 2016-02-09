'use strict';

require('dotenv').load();

const express = require('express');
const expressValidator = require('express-validator');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const resJsonWithStatusCode = require('./middlewares/resJsonWithStatusCode');
const suppressStatusCode = require('./middlewares/suppressStatusCode');

const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressValidator({
  errorFormatter: function (param, message, value) {
    return { param, message, value };
  }
}));

app.use(cookieParser());

const cookieOptions = {
  maxAge: 365 * 24 * 60 * 60 * 1000 // one year
};

if (process.env.NODE_ENV === 'production') {
  cookieOptions.secure = true;
}

app.use(session({
  store: new RedisStore(),
  secret: process.env.SESSION_SECRET || 'session secret',
  name: 'sid',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: cookieOptions
}));

if (process.env.WATCHING) {
  app.use(express.static(path.join(__dirname, 'web/.tmp')));
  app.use(express.static(path.join(__dirname, 'web/app')));
  app.use('/bower_components', express.static(path.join(__dirname, 'web/bower_components')));
} else {
  app.use(express.static(path.join(__dirname, 'web/dist')));
}


app.use(suppressStatusCode);
app.use(resJsonWithStatusCode);

// OAuth
app.use('/oauth', require('./routers/oauth'));

// pages
app.use('/pages', require('./routers/pages'));

// users
app.use('/users', require('./routers/users'));

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

module.exports = app;
