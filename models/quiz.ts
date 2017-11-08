const Logger = require('../models/logger');
const db = require('../db/database').getDb;
const types = require('sequelize').DataTypes;

module.exports.Category = db.define('category', {
    id: {
        type: types.UUID, primaryKey: true, allowNull: false, defaultValue: db.fn('uuid_generate_v4')
    },
    description: {
        type: types.TEXT, allowNull: false
    },
    title: {
        type: types.TEXT, allowNull: false
    }
}
