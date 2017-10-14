const db = require('../db/database').getDb;
const types = require('sequelize').DataTypes;

module.exports.Token = db.define('token', {
    id: {
        type: types.UUID, allowNull: false, primaryKey: true, unique: true, defaultValue: db.fn('uuid_generate_v4')
    },
    access_token: {
        type: types.TEXT, allowNull: false
    },
    access_token_expires_on: {
        type: types.DATE, allowNull: false
    },
    refresh_token: {
        type: types.TEXT
    },
    refresh_token_expires_on: {
        type: types.DATE
    },
    scope: {
        type: types.TEXT
    }
});