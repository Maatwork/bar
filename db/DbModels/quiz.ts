const Logger = require('./logger');
const db = require('../database').getDb;
const types = require('sequelize').DataTypes;

module.exports.Quiz = db.define('quiz', {
    id: {
        type: types.UUID, primaryKey: true, allowNull: false, defaultValue: db.fn('uuid_generate_v4')
    },
    title: {
        type: types.TEXT, allowNull: false
    },
    description: {
        type: types.TEXT, allowNull: false
    },
    category: {
        type: types.TEXT, allowNull: true
    },
    image: {
        type: types.TEXT, allowNull: true
    }

}
