/**
 * Module dependencies.
 */

var express = require('express'),
  path  = require('path'),
  favicon = require('serve-favicon'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  FileStore = require('session-file-store')(session),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  http = require('http');

var routes = require('./routes/index'),
    user = require('./routes/user'),
    api = require('./routes/api');
var app = express();



// Configuration
  app.use(favicon(__dirname + '/public/favicon.ico'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(__dirname + '/public'));
  // app.use(app.router);
  app.use(cookieParser());
  app.use(session({
    secret: 'myblog',
    resave: false,
    saveUninitialized: false,
  }));

  app.use('/user', user);
  app.use('/api', api);
  app.use('/', routes);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });



module.exports = app;
