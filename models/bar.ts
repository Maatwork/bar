const Logger = require('../models/logger');

const db = require('../db/database').getDb;
const types = require('sequelize').DataTypes;
const event = require('../models/event');

module.exports.Bar  = db.define('bar', {
    id: {
        type: types.UUID, unique: true, primaryKey: true, defaultValue: db.fn('uuid_generate_v4')
    },
    name: {
        type: types.TEXT, allowNull: false
    },
    description: {
        type: types.TEXT
    },
    photos: {
        type: types.ARRAY(types.TEXT)
    },
    location: {
        type: types.TEXT
}
});