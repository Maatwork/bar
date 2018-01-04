const bar = require('./DbModels/bar').Bar;
const client = require('./DbModels/client').Client;
const event = require('./DbModels/event').Event;
const authorizationCode = require('./DbModels/authorizationCode').AuthorizationCode;
const token = require('./DbModels/token').Token;
const user = require('./DbModels/user').User;
const db = require('../db/database').getDb;
const quiz = require('./DbModels/quiz').Quiz;
const question = require('./DbModels/question').Question;
const logger = require('./DbModels/logger');
const oAuthModel = require('./DbModels/oAuthModel');
const quiz = require('./DbModels/quiz').Quiz;

module.exports.estabilishFKs = () => {
    authorizationCode.belongsTo(user);
    authorizationCode.belongsTo(client);
    user.hasMany(bar);
    bar.belongsTo(user);
    client.belongsTo(user);
    token.belongsTo(user);
    token.belongsTo(client);
    question.belongsTo(quiz);
    bar.hasMany(event);
    event.belongsTo(bar);

};

module.exports.Bar = bar;
module.exports.Client = client;
module.exports.Event = event;
module.exports.Token = token;
module.exports.User = user;
module.exports.Logger = logger;
module.exports.OAuthModel = oAuthModel;
module.exports.Question = question;
module.exports.Quiz = quiz;