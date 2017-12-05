const bar = require('../models/bar').Bar;
const client = require('../models/client').Client;
const event = require('../models/event').Event;
const authorizationCode = require('../models/authorizationCode').AuthorizationCode;
const token = require('../models/token').Token;
const user = require('../models/user').User;
const db = require('../db/database').getDb;
const quiz = require('../models/quiz').Quiz;
const question = require('../models/question').Question;

module.exports.estabilishFKs = () => {
    bar.hasMany(event);
    authorizationCode.belongsTo(user);
    authorizationCode.belongsTo(client);
    user.belongsTo(bar);
    client.belongsTo(user);
    token.belongsTo(user);
    token.belongsTo(client);
    question.belongsTo(quiz);
};

module.exports.Bar = bar;
module.exports.Client = client;
module.exports.Event = event;
module.exports.Token = token;
module.exports.User = user;