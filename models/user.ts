const { Pool } = require('pg');

const pool = new Pool();
const client = require('../models/client');

const bcrypt = require('bcryptjs');
const Logger = require('../models/logger');

module.exports.getAccessToken = function(bearerToken, callback) {
    const sql = 'SELECT access_token, access_token_expires_on, client_id, user_id, scope FROM tokens WHERE access_token = $1';
    pool.query(sql, [bearerToken], (err, result) => {
        if (err) {
            Logger.log('error', err);
            callback(err, '')
        } else {
            const token = result.rows[0]; //select the first. #lazy
            if (token) {
                callback(err, {
                    accessToken: token.access_token,
                    client: {id: token.client_id},
                    accessTokenExpiresAt: new Date(token.access_token_expires_on + "+0000"),
                    user: {id: token.user_id},
                    scope: token.scope
                })
            } else {
                callback(err, '')
            }
        }
    })
};

module.exports.getRefreshToken = function (bearerToken, callback) {
    const sql = 'SELECT client_id, refresh_token, refresh_token_expires_on, user_id FROM tokens WHERE refresh_token = $1';

     pool.query(sql, [bearerToken], (err, result) => {
        if (err) {
            Logger.log('error', err);
            callback(err, null)
        } else {
            const token = result.rows[0]; //select the first. #lazy
            callback(err, {
                refreshToken: token.refresh_token,
                refreshTokenExpiresAt: token.refresh_token_expires_on,
                client: { id: token.client_id },
                user: {id: token.user_id }
            })
        }
    })
};

module.exports.verifyScope = (token, scope) => {
  //  Logger.log('info', "Verifying scope with token scope " + token.scope + " and general scope " + scope);
    if (!token.scope) {
        return false;
    }
    const authorizedScopes = token.scope.split(' ');
    return scope.split(' ').every(scope => authorizedScopes.indexOf(scope) != -1)
};

module.exports.validateScope = (user, client, scope) => {
 //   Logger.log('info', "Validating scope with client scope " + client.scope + " and general scope " + scope);
    if (!scope.split(' ').every(s => client.scope.indexOf(s) != -1)) return false;
    return scope;
};

module.exports.getClient = client.getClient;

module.exports.getUserByUsername = function (username, callback) {
    const sql = 'SELECT * FROM users WHERE username = $1';
    pool.query(sql, [username], (err, result) => {
        if (err) {
            Logger.log('error', err);
            callback(err, '');
        } else {
            callback('', result.rows[0])
        }
    })
};

module.exports.getUserById = function (id, callback) {
    const sql = 'SELECT * FROM users WHERE id = $1';
    pool.query(sql, [id], (err, result) => {
        if (err) {
            Logger.log('error', err);
            callback(err, '');
        } else {
            callback('', result.rows[0])
        }
    })
};

module.exports.getUser = function (username, password, callback) {
    const sql = 'SELECT * FROM users WHERE username = $1';
    pool.query(sql, [username], (err, result) => {
        if (err) {
            Logger.log('error', err);
            callback(err, '');
        } else {
            bcrypt.compare(password, result.rows[0].password, (err, res) =>
            {
                if (res) {
                    callback(err, result.rows[0]) //select the first. #lazy
                } else {
                    callback(err, '');
                }
            })
        }
    })
};

module.exports.setUserBar = function (bar_id, user_id, callback) {
    const sql = 'UPDATE users SET bar_id = $1  WHERE id = $2';
    pool.query(sql, [bar_id, user_id], (err, result) => {
        if (err) {
            Logger.log('error', err);
            callback(err, false);
        } else {
            callback(err, true)
        }
    })
};

module.exports.saveUser = function (username, password, req, resp, callback) {
    bcrypt.genSalt(14, (err, salt) => {
        if (err) {
            Logger.log('error', err);
            callback(err, { username: username }, req, resp)
        } else {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                Logger.log('error', err);
                callback(err, { username: username }, req, resp)
            } else {
                const sql = 'INSERT INTO users(id, username, password) VALUES(uuid_generate_v4(), $1, $2) returning id, username, password';
                pool.query(sql, [username, hash], (err, _) => callback(err, { username: username, password: password }, req, resp));
            }
        });
        }
    });
};

module.exports.saveAuthorizationCode = function (code, client, user, callback) {
    const sql = 'INSERT INTO authorization_codes(id, authorization_code, expires_on, redirect_url, scope, client_id, user_id) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6) returning id, authorization_code, expires_on, redirect_url, scope, client_id, user_id';

    pool.query(sql, [code.authorizationCode, code.expiresAt, code.redirectUri, code.scope, client.id, user.id], (err, result) => {
        if (err) {
            Logger.log('error', err);
            callback(err, null);
        } else {
            callback(err, result.rows[0])
        }
    })
};

module.exports.saveToken = function (token, client, user, callback) {
    const sql = 'INSERT INTO tokens(id, access_token, access_token_expires_on, refresh_token, refresh_token_expires_on, scope, client_id, user_id) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7) returning access_token, access_token_expires_on, refresh_token, refresh_token_expires_on, scope, client_id, user_id';

    pool.query(sql, [token.accessToken, token.accessTokenExpiresAt, token.refreshToken, token.refreshTokenExpiresAt, token.scope, client.id, user.id], (err, result) => {
        if (err) {
            Logger.log('error', err);
            callback(err, null);
        } else {
            let token = result.rows[0];
            callback(err, {
                accessToken: token.access_token,
                accessTokenExpiresAt: token.access_token_expires_on,
                refreshToken: token.refresh_token,
                refreshTokenExpiresAt: token.refresh_token_expires_on,
                scope: token.scope,
                client: {id: token.client_id},
                user: {id: token.user_id}
            })
        }
    })
};