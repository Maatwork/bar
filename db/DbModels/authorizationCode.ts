const db = require('../database').getDb;
const types = require('sequelize').DataTypes;

module.exports.AuthorizationCode = db.define('authorization_code', {
    id: {
        type: types.UUID, primaryKey: true, allowNull: false, defaultValue: db.fn('uuid_generate_v4')
    },
    authorization_code: {
        type: types.TEXT, allowNull: false
    },
    expires_on: {
        type: types.DATE, allowNull: false
    },
    redirect_url: {
        type: types.TEXT, validate: {isURL: true}
    },
    scope: {
        type: types.TEXT
    }
}, {
    indexes: [{
        method: 'BTREE',
        fields: ['authorization_code']
    }]
});