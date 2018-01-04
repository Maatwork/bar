import {error} from "util";

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');
const OAuthServer = require('express-oauth-server');
const session = require('express-session');

const passport = require('passport');
require('./config/passport')(passport); //setup passport

const Logger = require('./db/models').Logger;


require('./db/models').estabilishFKs();
require('./db/database').getDb.sync();

const app = module.exports = express();

app.oauth = new OAuthServer ({
    model: require('./db/models').OAuthModel
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(Logger.getRequestLogger);

app.use(express.static(path.join(__dirname, 'public')));
app.use(session( { secret: "Corgis are vastly superior to shibes", resave: true, saveUninitialized: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('corgi'));
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

require('./routes/routes')(app); //setup routes



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
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
