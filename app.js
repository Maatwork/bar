"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');
var OAuthServer = require('express-oauth-server');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var Logger = require('./models/logger');
var index = require('./routes/index');
var register = require('./routes/register');
var clients = require('./routes/clients');
var questions = require('./routes/api/questions');
var quizzes = require('./routes/api/quizzes');
var barLocal = require('./routes/bar');
var barApi = require('./routes/api/bar');
var events = require('./routes/api/event');
var me = require('./routes/oauth/me');
require('./db/foreignkeys').estabilishFKs();
//require('./db/database').getDb.sync();
//require('./db/database').Event.sync({alter: true});
var User = require('./models/user').User;
var Client = require('./models/client').Client;
var app = express();
var noCORS = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    console.log(JSON.stringify(req.header));
    res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
    res.header('Access-Control-Allow-Methods', req.header('Access-Control-Request-Method'));
    next();
};
//require('./db/foreignkeys').estabilishFKs();
require('./db/database').getDb.sync();
passport.use(new LocalStrategy(function (username, password, callback) {
    var bcrypt = require('bcryptjs');
    User.findOne({ where: { username: username } }, { raw: true }).
        then(function (user) {
        if (!user) {
            return callback(null, false, { message: 'User does not exist', username: '' });
        }
        bcrypt.compare(password, user.password)
            .then(function (res) {
            if (!res)
                return callback(null, false, { message: 'Password is incorrect', username: username });
            return callback(null, user);
        });
    });
}));
passport.serializeUser(function (user, callback) {
    callback(null, user.id);
});
passport.deserializeUser(function (id, callback) {
    User.findOne({ where: { id: id } }).then(function (user) {
        if (user) {
            return callback(null, user);
        }
        else {
            callback(false, false);
        }
    });
});
app.oauth = new OAuthServer({
    model: require('./models/oAuthModel')
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(Logger.getRequestLogger);
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "Corgis are vastly superior to shibes", resave: true, saveUninitialized: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('corgi'));
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', index);
app.use('/register', register);
app.use('/clients/', clients);
app.use('/api/quizzes/', noCORS, quizzes);
app.use('/api/questions/', noCORS, questions);
app.use('/api/bars/', noCORS, barApi);
app.use('/api/events', noCORS, events);
app.use('/bar/', barLocal);
app.use('/oauth/me', noCORS, me);
//app.use('/users', users);
app.get('/oauth/authorize', function (req, res) {
    if (req.user) {
        if (!req.query.clientId)
            return res.send('Please send a clientID!');
        Client.findOne({ where: { id: req.query.clientId } }, { raw: true })
            .then(function (client) {
            if (!client)
                return res.send('ERROR invalid client ID!');
            res.render('oauth/authorize', { title: 'Authorize', scope: req.query.scope, client: client, state: req.query.state, redirectUri: client.redirect_url });
        });
    }
    else {
        req.session.redirectTo = req.originalUrl;
        res.redirect('/login');
    }
});
app.post("/oauth/token", app.oauth.token());
app.post("/oauth/authorize", noCORS, app.oauth.authorize());
app.options("/oauth/token", noCORS, function (req, res) {
    res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
    res.send(200);
});
app.post("/oauth/token", noCORS, app.oauth.token());
app.get('/login', function (req, res) {
    res.render('user/login', { msg: '', title: 'Login', username: '' });
});
app.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render('user/login', { msg: info.message, title: 'Login', username: info.username });
        }
        req.login(user, function (err) {
            if (err)
                return next(err);
            var redirectURL = '/';
            if (req.session.redirectTo)
                redirectURL = req.session.redirectTo;
            req.session.redirectTo = null;
            res.redirect(redirectURL);
        });
    })(req, res, next);
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(Logger.getErrorLogger);
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
//# sourceMappingURL=app.js.map