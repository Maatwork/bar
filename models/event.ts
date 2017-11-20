const db = require('../db/database').getDb;
const types = require('sequelize').DataTypes;

module.exports.Event  = db.define('event', {
    id: {
        type: types.UUID, allowNull: false, unique: true, primaryKey: true, defaultValue: db.fn('uuid_generate_v4')
    },
    name: {
        type: types.TEXT, allowNull: false
    },
    description: {
        type: types.TEXT
    },
    start: {
        type: types.DATE, allowNull: false
    },
    end: {
        type: types.DATE
    },
}, {
    indexes: [
        {
            method: 'BTREE',
            fields: ['start'],
            order: 'DESC'
        }
    ]
});