const db = require('../database').getDb;
const types = require('sequelize').DataTypes;

module.exports.Client = db.define('client',
    {
        id: {
            type: types.TEXT, allowNull: false, primaryKey: true, unique: true
        },
        client_secret: {
            type: types.UUID, allowNull: false, defaultValue: db.fn("uuid_generate_v4")
        },
        redirect_url: {
            type: types.TEXT, allowNull: false,
            validate: {isURL: true}
        },
        grants: {
            type: types.ARRAY(types.TEXT),
            defaultValue: ['authorization_code', 'client_credentials', 'refresh_token', 'password']
        },
        scopes: {
            type: types.ARRAY(types.TEXT), defaultValue: ['bar']
        }
    });