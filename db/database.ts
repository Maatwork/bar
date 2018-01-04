const Logger = require('./DbModels/logger');

const config    = require('../config/config.json');
const Sequelize = require('sequelize');
const sequel = new Sequelize(config.database, config.username, config.password, config);

sequel.authenticate()
    .then((_) => Logger.log('debug', 'Successfully connected to the database'))
    .catch((error: Error) => Logger.log('error', 'Failed to connect to the database, ' + error));

module.exports.getDb = sequel;