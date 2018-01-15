const Logger = require('./logger');

const db = require('../database').getDb;
const types = require('sequelize').DataTypes;

module.exports.Bar = db.define('bar', {
    id: {
        type: types.UUID, unique: true, primaryKey: true, defaultValue: db.fn('uuid_generate_v4')
    },
    name: {
        type: types.TEXT, unique: false, allowNull: false
    },
    description: {
        type: types.TEXT
    },
    photos: {
        type: types.JSON
    },
    city: {
        type: types.TEXT
    },
    zipcode: {
        type: types.TEXT
    },
    address: {
        type: types.TEXT
    }
});