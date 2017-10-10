import {error} from "util";

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');
const OAuthServer = require('express-oauth-server');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const Logger = require('./models/logger');


const index = require('./routes/index');
const register = require('./routes/register');
const clients = require('./routes/clients');
const playlists = require('./routes/playlists');


const userModel = require('./models/user');
const clientModel = require('./models/client');
const app = express();

passport.use(new LocalStrategy(
    function(username, password, callback) {
        var bcrypt = require('bcryptjs');
        userModel.getUserByUsername(username, function (err, user) {
            if (err) { return callback(err); }
            if (!user) { return callback(null, false, { message: 'User does not exist', username: '' }); }
            bcrypt.compare(password, user.password, (err, res) => {
                if (err) Logger.log('error', err);
                if (res) return callback(null, user);
                return callback(null, false, { message: 'Password is incorrect', username: username });
            });
        });
    }
));

passport.serializeUser(function(user, callback) {
    callback(null, user.id);
});

passport.deserializeUser(function(id, callback) {
    userModel.getUserById(id, function (err, user) {
        if (err) { return callback(err); }
        callback(null, user);
    });
});


app.oauth = new OAuthServer ({
  model: userModel
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(Logger.getRequestLogger);

app.use(express.static(path.join(__dirname, 'public')));
app.use(session( { secret: "Corgis are vastly superior to shibes", resave: true, saveUninitialized: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('corgi'));
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/register', register);
app.use('/clients/', clients);
app.use('/api/playlists/', playlists);
//app.use('/users', users);
app.get('/oauth/authorize', (req, res) => {
    if (req.user) {
      if (!req.query.clientId) return res.send('Please send a clientID!');
      clientModel.getClient(req.query.clientId, '', (err, usedClient) => {
        if (err) return Logger.log('error', err);
        if (!usedClient) return res.send('ERROR invalid client ID!');
          res.render('authorize', {title: 'Authorize', scope: req.query.scope, client: usedClient, state: req.query.state, redirectUri: usedClient.redirect_url });
        })
    } else {
      req.session.redirectTo = req.originalUrl;
      res.redirect('/login');
    }
});
app.post("/oauth/authorize", app.oauth.authorize());
app.post("/oauth/token", app.oauth.token());

app.get('/login', (req, res) => {
        res.render('login', { msg: '', title: 'Login', username: '' });
});

app.post('/login', (req, res, next ) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) { return res.render('login', { msg: info.message, title: 'Login', username: info.username }) }
        req.login(user, err => {
          if (err) return next(err);
          let redirectURL = '/';
          if (req.session.redirectTo) redirectURL = req.session.redirectTo;
          req.session.redirectTo = null;
           res.redirect(redirectURL);
        });
    })(req, res, next);
});

// catch 404 and forward to error handler

app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(Logger.getErrorLogger);

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
