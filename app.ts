import {error} from "util";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');
var OAuthServer = require('express-oauth-server');
const { Pool } = require('pg');

const pool = new Pool()

pool.query('SELECT * FROM users', (err, res) => {
  console.log(err, res);
  pool.end
})
const index = require('./routes/index');
const register = require('./routes/register');
const authorize = require('./routes/authorize');
const clients = require('./routes/clients');
const clientRoute = require('./routes/client');

const userModel = require('./models/user');

var app = express();

app.oauth = new OAuthServer ({
  model: userModel
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/register', register);
app.use('/clients', clients);
app.use('/client', clientRoute);
//app.use('/users', users);
app.get("/oauth/authorize", authorize);
app.post("/oauth/authorize", app.oauth.authorize());
app.post("/oauth/token", app.oauth.token());
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
