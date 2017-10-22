const Logger = require('../models/logger');
const db = require('../db/database').getDb;
const types = require('sequelize').DataTypes;

module.exports.User = db.define('user', {
    id: {
        type: types.UUID, primaryKey: true, allowNull: false, defaultValue: db.fn('uuid_generate_v4')
    },
    username: {
        type: types.TEXT, unique: { msg: 'This username already exists.'}, allowNull: false,
        validate: {
            len: { args: [3, 20], msg: "Please pick a username between 3 and 20 characters"}
        }
    },
    password: {
        type: types.TEXT, allowNull: false,
        validate: { notEmpty: { args: true, msg: "Please pick a non-empty password."} }
    },
    email: {
            type: types.TEXT, allowNull: false,
            validate: { isEmail: { args: true, msg: "Please fill in a valid email address."} }
        },
    isadmin: {
        type: types.BOOLEAN, defaultValue: false
    }
    }
    );
//
// module.exports.saveUser = function (username, password, req, resp, callback) {
//     bcrypt.genSalt(14, (err, salt) => {
//         if (err) {
//             Logger.log('error', err);
//             callback(err, { username: username }, req, resp)
//         } else {
//             bcrypt.hash(password, salt, (err, hash) => {
//                 if (err) {
//                     Logger.log('error', err);
//                     callback(err, { username: username }, req, resp)
//                 } else {
//                     const sql = 'INSERT INTO users(id, username, password) VALUES(uuid_generate_v4(), $1, $2) returning id, username, password';
//                     pool.query(sql, [username, hash], (err, _) => callback(err, { username: username, password: password }, req, resp));
//                 }
//             });
//         }
//     });
// };