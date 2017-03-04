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
const {createErrorResponse} = require('./utils/error');
const {errorFormatter, customValidators} = require('./validator');

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

app.use(expressValidator({ errorFormatter, customValidators }));

app.use(cookieParser());

const cookieOptions = {
  maxAge: 365 * 24 * 60 * 60 * 1000 // one year
};

if (process.env.NODE_ENV === 'production') {
  cookieOptions.secure = true;
}

app.use(session({
  store: new RedisStore({
    host: process.env.REDIS_HOST || '127.0.0.1'
  }),
  secret: process.env.SESSION_SECRET || 'session secret',
  name: 'sid',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: cookieOptions,
  proxy: true
}));

if (process.env.WATCHING) {
  app.use(express.static(path.join(__dirname, '../web/.tmp')));
  app.use(express.static(path.join(__dirname, '../web/app')));
  app.use('/bower_components', express.static(path.join(__dirname, '../web/bower_components')));
} else {
  app.use(express.static(path.join(__dirname, '../web/dist')));
}


app.use(suppressStatusCode);
app.use(resJsonWithStatusCode);

app.use('/oauth', require('./routers/oauth'));
app.use('/users', require('./routers/users'));

// APIs
const apiRouter = express.Router();
apiRouter.use('/pages', require('./routers/api/pages'));
apiRouter.use('/users', require('./routers/api/users'));

// catch 404 and forward to error handler
apiRouter.use(function(req, res, next) {
  next(createErrorResponse('Sorry, the endpoint does not exist', 404));
});

// Error handlers
apiRouter.use(function(err, req, res, next) {
  res.status(err.status || 500).send(err);
});

app.use('/api/v1', apiRouter);

module.exports = app;
