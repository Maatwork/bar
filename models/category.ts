const { Pool } = require('pg');

const pool = new Pool();
const Logger = require('../models/logger');


module.exports.getCategories = function (callback: Function) {
    const sql = 'SELECT * FROM category';
    pool.query(sql, (err: String, result) => callback(err, result))
};