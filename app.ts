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
const questions = require('./routes/api/questions');
const categories = require('./routes/api/categories');
const barLocal = require('./routes/bar');
const playlists = require('./routes/api/playlists');
const barApi = require('./routes/api/bar');


require('./db/foreignkeys').estabilishFKs();
//require('./db/database').getDb.sync({force: true});

const User = require('./models/user').User;
const Client = require('./models/client').Client;
const app = express();


//require('./db/foreignkeys').estabilishFKs();
require('./db/database').getDb.sync();



passport.use(new LocalStrategy((username: String, password: String, callback: Function) => {
        let bcrypt = require('bcryptjs');
        User.findOne({where: {username: username}}, {raw: true}).
            then(user => {
            if (!user) { return callback(null, false, { message: 'User does not exist', username: '' }); }
    bcrypt.compare(password, user.password)
        .then(res => {
            if (!res) return callback(null, false, { message: 'Password is incorrect', username: username });
            return callback(null, user);
        });
    });
        }));

passport.serializeUser(function(user, callback) {
    callback(null, user.id);
});

passport.deserializeUser(function(id, callback) {
    User.findOne({where: {id: id}}).then(user => {
        if (user) {
            return callback(null, user)
        } else {
            callback(false, false);
        }
    });
});


app.oauth = new OAuthServer ({
  model: require('./models/oAuthModel')
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
app.use('/api/categories/', categories);
app.use('/api/questions/', questions);
app.use('/api/bars/', barApi);
app.use('/bar/', barLocal);
//app.use('/users', users);
app.get('/oauth/authorize', (req, res) => {
    if (req.user) {
      if (!req.query.clientId) return res.send('Please send a clientID!');
        Client.findOne({where: {id: req.query.clientId}}, {raw: true})
            .then(client => {
                if (!client) return res.send('ERROR invalid client ID!');
                res.render('oauth/authorize', {title: 'Authorize', scope: req.query.scope, client: client, state: req.query.state, redirectUri: client.redirect_url });

            });
    } else {
      req.session.redirectTo = req.originalUrl;
      res.redirect('/login');
    }
});


app.post("/oauth/authorize", app.oauth.authorize());
app.post("/oauth/token", app.oauth.token());

app.get('/login', (req, res) => {
        res.render('user/login', { msg: '', title: 'Login', username: '' });
});

app.post('/login', (req, res, next ) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) { return res.render('user/login', { msg: info.message, title: 'Login', username: info.username }) }
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
