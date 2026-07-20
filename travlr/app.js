var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var handlebars = require('hbs');

// Load environment variables before modules that may use them.
require('dotenv').config();

// Bring in the database and authentication configuration.
require('./app_api/models/db');
require('./app_api/config/passport');

var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
var travelRouter = require('./app_server/routes/travel');
var apiRouter = require('./app_api/routes/index');

var app = express();

// View engine setup.
app.set('views', path.join(__dirname, 'app_server', 'views'));

// Register Handlebars partials.
handlebars.registerPartials(
  path.join(__dirname, 'app_server', 'views', 'partials')
);

app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// Enable CORS for the Angular administrative application.
// The environment variable allows the origin to be changed without
// modifying the application source code.
const allowedOrigin =
process.env.CLIENT_ORIGIN || 'http://localhost:4200';

app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );

  // End browser preflight requests before they reach the API routes.
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// Wire routes to controllers.
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);
app.use('/api', apiRouter);

// Catch authentication errors forwarded by Passport or other middleware.
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: `${err.name}: ${err.message}`
    });
  }

  next(err);
});

// Catch 404 and forward to the error handler.
app.use((req, res, next) => {
  next(createError(404));
});

// General error handler.
app.use((err, req, res, next) => {
  // API clients should receive JSON rather than an HTML error page.
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.status || 500).json({
      message:
      req.app.get('env') === 'development'
      ? err.message
      : 'An unexpected server error occurred.'
    });
  }

  // Server-rendered pages continue to use the existing error view.
  res.locals.message = err.message;
  res.locals.error =
  req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
