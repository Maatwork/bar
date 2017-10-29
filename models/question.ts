const Logger = require('../models/logger');
const db = require('../db/database').getDb;
const types = require('sequelize').DataTypes;

module.exports.Question = db.define('question', {
        id: {
            type: types.UUID, primaryKey: true, allowNull: false, defaultValue: db.fn('uuid_generate_v4')
        },
        text: {
            type: types.TEXT, allowNull: false
        }
    }
);

/*module.exports.getQuestions = function (questionID, callback) {
    const sql = 'SELECT * FROM question, answer WHERE question.questionid = answer.questionid AND question.questionID = $1';
    pool.query(sql, [questionID],(err: String, result) =>
        callback(err, result))
};*/