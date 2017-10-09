"use strict";
var Pool = require('pg').Pool;
var pool = new Pool();
var client = require('../models/client');
var bcrypt = require('bcryptjs');
module.exports.getAccessToken = function (bearerToken, callback) {
    var sql = 'SELECT access_token, access_token_expires_on, client_id, user_id, scope FROM tokens WHERE access_token = $1';
    pool.query(sql, [bearerToken], function (err, result) {
        if (err) {
            console.log(err);
            callback(err, '');
        }
        else {
            var token = result.rows[0]; //select the first. #lazy
            if (token) {
                callback(err, {
                    accessToken: token.access_token,
                    client: { id: token.client_id },
                    accessTokenExpiresAt: new Date(token.access_token_expires_on + "+0000"),
                    user: { id: token.user_id },
                    scope: token.scope
                });
            }
            else {
                callback(err, '');
            }
        }
    });
};
module.exports.getRefreshToken = function (bearerToken, callback) {
    var sql = 'SELECT client_id, refresh_token, refresh_token_expires_on, user_id FROM tokens WHERE refresh_token = $1';
    pool.query(sql, [bearerToken], function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        }
        else {
            var token = result.rows[0]; //select the first. #lazy
            callback(err, {
                refreshToken: token.refresh_token,
                refreshTokenExpiresAt: token.refresh_token_expires_on,
                client: { id: token.client_id },
                user: { id: token.user_id }
            });
        }
    });
};
module.exports.verifyScope = function (token, scope) {
    console.log("Verifying scope with token scope " + token.scope + " and general scope " + scope);
    if (!token.scope) {
        return false;
    }
    var authorizedScopes = token.scope.split(' ');
    return scope.split(' ').every(function (scope) { return authorizedScopes.indexOf(scope) != -1; });
};
module.exports.validateScope = function (user, client, scope) {
    console.log("Validating scope with client scope " + client.scope + " and general scope " + scope);
    if (!scope.split(' ').every(function (s) { return client.scope.indexOf(s) != -1; }))
        return false;
    return scope;
};
module.exports.getClient = client.getClient;
module.exports.getUserByUsername = function (username, callback) {
    var sql = 'SELECT * FROM users WHERE username = $1';
    pool.query(sql, [username], function (err, result) {
        if (err) {
            console.log(err);
            callback(err, '');
        }
        else {
            callback('', result.rows[0]);
        }
    });
};
module.exports.getUserById = function (id, callback) {
    var sql = 'SELECT * FROM users WHERE id = $1';
    pool.query(sql, [id], function (err, result) {
        if (err) {
            console.log(err);
            callback(err, '');
        }
        else {
            callback('', result.rows[0]);
        }
    });
};
module.exports.getUser = function (username, password, callback) {
    var sql = 'SELECT * FROM users WHERE username = $1';
    pool.query(sql, [username], function (err, result) {
        if (err) {
            console.log(err);
            callback(err, '');
        }
        else {
            bcrypt.compare(password, result.rows[0].password, function (err, res) {
                if (res) {
                    callback(err, result.rows[0]); //select the first. #lazy
                }
                else {
                    callback(err, '');
                }
            });
        }
    });
};
module.exports.saveUser = function (username, password, res, callback) {
    bcrypt.genSalt(14, function (err, salt) {
        if (err) {
            console.log(err);
            callback(err, username, res);
        }
        else {
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                    callback(err, username, res);
                }
                else {
                    var sql = 'INSERT INTO users(id, username, password) VALUES(uuid_generate_v4(), $1, $2) returning id, username, password';
                    pool.query(sql, [username, hash], function (err, _) { return callback(err, username, res); });
                }
            });
        }
    });
};
module.exports.saveAuthorizationCode = function (code, client, user, callback) {
    var sql = 'INSERT INTO authorization_codes(id, authorization_code, expires_on, redirect_url, scope, client_id, user_id) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6) returning id, authorization_code, expires_on, redirect_url, scope, client_id, user_id';
    pool.query(sql, [code.authorizationCode, code.expiresAt, code.redirectUri, code.scope, client.id, user.id], function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        }
        else {
            callback(err, result.rows[0]);
        }
    });
};
module.exports.saveToken = function (token, client, user, callback) {
    var sql = 'INSERT INTO tokens(id, access_token, access_token_expires_on, refresh_token, refresh_token_expires_on, scope, client_id, user_id) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7) returning access_token, access_token_expires_on, refresh_token, refresh_token_expires_on, scope, client_id, user_id';
    pool.query(sql, [token.accessToken, token.accessTokenExpiresAt, token.refreshToken, token.refreshTokenExpiresAt, token.scope, client.id, user.id], function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        }
        else {
            var token_1 = result.rows[0];
            callback(err, {
                accessToken: token_1.access_token,
                accessTokenExpiresAt: token_1.access_token_expires_on,
                refreshToken: token_1.refresh_token,
                refreshTokenExpiresAt: token_1.refresh_token_expires_on,
                scope: token_1.scope,
                client: { id: token_1.client_id },
                user: { id: token_1.user_id }
            });
        }
    });
};
