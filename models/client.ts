const { Pool } = require('pg');

const pool = new Pool();

module.exports.getClient = function (clientId: String, clientSecret: String, callback: Function) {
    const sql = 'SELECT id, client_secret, redirect_url FROM clients WHERE id = $1 AND client_secret = $2';

    pool.query(sql, [clientId, clientSecret], (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            const client = result.rows[0]; //select the first. #lazy
            callback(err, {
                id: client.id,
                redirectUris: [client.redirect_url],
                grants: [],
            })
        }
    })
};

module.exports.saveClient = function (clientId: String, redirect_url: String, callback: Function) {
    const sql = 'INSERT INTO clients(id, client_secret, redirect_url) VALUES($1, uuid_generate_v4(), $2) returning id, client_secret, redirect_url';

    pool.query(sql, [clientId, redirect_url], (err, result) => {
        if (err) {
            console.log(err);
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