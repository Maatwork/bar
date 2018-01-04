const index = require('./index');
const login = require('./login');
const register = require('./register');
const clients = require('./clients');

const questions = require('./api/questions');
const quizzes = require('./api/quizzes');
const barApi = require('./api/bar');
const events = require('./api/event');

const me = require('./oauth/me');
const authorize = require('./oauth/authorize');
const token = require('./oauth/token');

const noCORS = require('../config/noCORS'); //nocors middleware.

module.exports = (app) => {
    app.use('/', index);
    app.use("/login", login);
    app.use('/register', register);
    app.use('/clients/', clients);

    app.use('/api/quizzes/', noCORS, quizzes);
    app.use('/api/questions/', noCORS, questions);
    app.use('/api/bars/', noCORS, barApi);
    app.use('/api/events', noCORS, events);

    app.use('/oauth/me', noCORS, me);
    app.use('/oauth/authorize', authorize);
    app.use('/oauth/token', noCORS, token);
};