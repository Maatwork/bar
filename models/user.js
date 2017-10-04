"use strict";
var Pool = require('pg').Pool;
var pool = new Pool();
module.exports.getAccessToken = function (bearerToken) {
    var sql = 'SELECT access_token, access_token_expires_on, client_id, user_id FROM oauth_tokens WHERE access_token = $1';
    pool.query(sql, [bearerToken], function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            var token = result.rows[0]; //select the first. #lazy
            return {
                accessToken: token.access_token,
                client: { id: token.client_id },
                accessTokenExpiresAt: result.access_token_expires_on,
                user: { id: token.user_id }
            };
        }
    });
};
module.exports.getRefreshToken = function (bearerToken) {
    var sql = 'SELECT client_id, refresh_token, refresh_token_expires_on, user_id FROM oauth_tokens WHERE refresh_token = $1';
    pool.query(sql, [bearerToken], function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            var token = result.rows[0]; //select the first. #lazy
            return {
                refreshToken: token.refresh_token,
                refreshTokenExpiresAt: token.refresh_token_expires_on,
                client: { id: token.client_id },
                user: { id: token.user_id }
            };
        }
    });
};
module.exports.getClient = function (clientId, clientSecret) {
    var sql = 'SELECT id, client_secret, redirect_url FROM clients WHERE id = $1 AND client_secret = $2';
    pool.query(sql, [clientId, clientSecret], function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            var client = result.rows[0]; //select the first. #lazy
            return {
                id: client.id,
                redirectUris: [client.redirect_url],
                grants: [],
            };
        }
    });
};
module.exports.getUser = function (username, password) {
    var sql = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    console.log('getting user!');
    pool.query(sql, [username, password], function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            return result.rows[0]; //select the first. #lazy
        }
    });
};
module.exports.saveUser = function (username, password, res) {
    var sql = 'INSERT INTO users(id, username, password) VALUES(uuid_generate_v4(), $1, $2)';
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
