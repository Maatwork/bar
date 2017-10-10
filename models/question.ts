const { Pool } = require('pg');

const pool = new Pool();
const Logger = require('../models/logger');


module.exports.getQuestions = function (questionID, callback) {
    const sql = 'SELECT * FROM question, answer WHERE question.questionid = answer.questionid AND question.questionID = $1';
    pool.query(sql, [questionID],(err: String, result) =>
        callback(err, result))
};