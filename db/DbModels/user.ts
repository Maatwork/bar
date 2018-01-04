const Logger = require('./logger');
const db = require('../database').getDb;
const types = require('sequelize').DataTypes;

module.exports.User = db.define('user', {
        id: {
            type: types.UUID, primaryKey: true, allowNull: false, defaultValue: db.fn('uuid_generate_v4')
        },
        username: {
            type: types.TEXT, unique: {msg: 'This username already exists.'}, allowNull: false,
            validate: {
                len: {args: [3, 20], msg: "Please pick a username between 3 and 20 characters"}
            }
        },
        password: {
            type: types.TEXT, allowNull: false,
            validate: {notEmpty: {args: true, msg: "Please pick a non-empty password."}}
        },
        email: {
            type: types.TEXT, allowNull: false,
            validate: {isEmail: {args: true, msg: "Please fill in a valid email address."}}
        },
        isadmin: {
            type: types.BOOLEAN, defaultValue: false
        }
    }
);