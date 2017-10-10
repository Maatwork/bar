const { Pool } = require('pg');

const pool = new Pool();
const Logger = require('../models/logger');


module.exports.getClient = function (clientId: String, clientSecret: String, callback: Function) {
    const sql = 'SELECT id, grants, client_secret, redirect_url, scopes FROM clients WHERE id = $1';
    pool.query(sql, [clientId], (err, result) => {
        if (err) {
            Logger.log('error', err);
            callback(err, '');
        } else {
            const client = result.rows[0]; //select the first. #lazy
            if (!client) return callback(err, '');
            if (!clientSecret || clientSecret == client.client_secret) {
                callback(err, {
                    id: client.id,
                    redirectUris: [client.redirect_url],
                    grants: client.grants,
                    scope: client.scopes
                })
            } else {
                callback('False secret', '')
            }
        }
    })
};

module.exports.saveClient = function (clientId: String, redirect_url: String, callback: Function) {
    const sql = 'INSERT INTO clients(id, client_secret, redirect_url) VALUES($1, uuid_generate_v4(), $2) returning id, client_secret, redirect_url';

    pool.query(sql, [clientId, redirect_url], (err, result) => {
        if (err) {
            callback(err, '');
        } else {
            return callback(err, result); //select the first. #lazy
        }
    })
};

module.exports.getClients = function (callback: Function) {
    const sql = 'SELECT * FROM clients';
    pool.query(sql, (err: String, result) => callback(err, result))
};