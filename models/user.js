"use strict";
var Pool = require('pg').Pool;
var pool = new Pool();
var client = require('../models/client');
module.exports.getAccessToken = function (bearerToken, callback) {
    var sql = 'SELECT access_token, access_token_expires_on, client_id, user_id FROM oauth_tokens WHERE access_token = $1';
    pool.query(sql, [bearerToken], function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        }
        else {
            var token = result.rows[0]; //select the first. #lazy
            callback(err, {
                accessToken: token.access_token,
                client: { id: token.client_id },
                accessTokenExpiresAt: result.access_token_expires_on,
                user: { id: token.user_id }
            });
        }
    });
};
module.exports.getRefreshToken = function (bearerToken, callback) {
    var sql = 'SELECT client_id, refresh_token, refresh_token_expires_on, user_id FROM oauth_tokens WHERE refresh_token = $1';
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
module.exports.getClient = client.getClient;
module.exports.getUser = function (username, password, callback) {
    var sql = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    console.log('getting user!');
    pool.query(sql, [username, password], function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        }
        else {
            callback(err, result.rows[0]); //select the first. #lazy
        }
    });
};
module.exports.saveUser = function (username, password, res) {
    var sql = 'INSERT INTO users(id, username, password) VALUES(uuid_generate_v4(), $1, $2) returning id, username, password';
    console.log('saving user!');
    pool.query(sql, [username, password], function (err, _) {
        if (err) {
            console.log(err);
            res.render('register', { title: 'Register', msg: err, username: username, password: password });
        }
        else {
            console.log('success!');
            res.render('index', { title: 'Success' });
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
            console.log(result.rows[0]);
            callback(err, result.rows[0]);
        }
    });
};
