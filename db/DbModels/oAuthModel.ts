const Client = require('./client').Client;
const Token = require('./token').Token;
const User = require('./user').User;
const AuthorizationCode = require('./authorizationCode').AuthorizationCode;

const Logger = require('./logger');
const bcrypt = require('bcryptjs');


module.exports.getClient = (clientId: String, clientSecret: String) => {
    let condition: any;
    if (clientSecret) condition = {id: clientId, client_secret: clientSecret};
    else condition = {id: clientId};
    return Client.findOne({where: condition})
        .then((client: any) => {
            return {
                id: client.id,
                redirectUris: client.redirect_url,
                grants: client.grants,
                scope: client.scopes,
                userId: client.userId
            };
        });
};

module.exports.getAccessToken = function (bearerToken) {
    return Token.findOne({
        attributes: ['access_token', 'access_token_expires_on', 'clientId', 'userId', 'scope'],
        where: {access_token: bearerToken}
    }).then((token: any) => {
        return {
            accessToken: token.access_token,
            client: {id: token.clientId},
            accessTokenExpiresAt: new Date(token.access_token_expires_on + "+0000"),
            user: {id: token.userId},
            scope: token.scope
        };
    });
};

module.exports.getRefreshToken = function (bearerToken) {
    return Token.findOne({
        attributes: ['refresh_token', 'refresh_token_expires_on', 'clientId', 'userId', 'scope'],
        where: {refresh_token: bearerToken}
    }).then((token: any) => {
        return {
            refreshToken: token.refresh_token,
            client: {id: token.clientId},
            refreshTokenExpiresAt: new Date(token.refresh_token_expires_on + "+0000"),
            user: {id: token.userId},
            scope: token.scope
        }
    });
};

module.exports.saveToken = function (token, client, user) {
    return Token.create({
        access_token: token.accessToken, access_token_expires_on: token.accessTokenExpiresAt,
        refresh_token: token.refreshToken, refresh_token_expires_on: token.refreshTokenExpiresAt,
        scope: token.scope, clientId: client.id, userId: user.id
    }, {raw: true}).then(token => {
        return {
            accessToken: token.access_token,
            accessTokenExpiresAt: token.access_token_expires_on,
            refreshToken: token.refresh_token,
            refreshTokenExpiresAt: token.refresh_token_expires_on,
            scope: token.scope,
            client: {id: token.clientId},
            user: {id: token.userId}
        }
    });
};


module.exports.revokeToken = (token) => {
    return Token.destroy({where: {refresh_token: token.refreshToken}})
        .then(res => {
            return res
        })
        .catch((err) => {
            return Logger.log('error', err)
        });
};

module.exports.verifyScope = (token, scope) => {
    if (!token.scope) {
        return false;
    }
    const authorizedScopes = token.scope.split(' ');
    return scope.split(' ').every(scope => authorizedScopes.indexOf(scope) != -1)
};

module.exports.validateScope = (user, client, scope) => {
    if (!scope.split(' ').every(s => client.scope.indexOf(s) != -1)) return false;
    return scope;
};

module.exports.getUser = (username, password) => {
    return User.findOne({
        where: {
            username: username,
        }
    }, {raw: true}).then(user => {
        return bcrypt.compare(password, user.password)
            .then(res => {
                if (res) return user;
                else return false;
            })
    }).catch((err) => {
        return Logger.log('error', err)
    });
};

module.exports.getUserFromClient = (client) => {
    return User.findOne({where: {id: client.userId}}, {raw: true})
        .then(user => {
            return user
        });
};

module.exports.saveAuthorizationCode = (code, client, user) => {
    return AuthorizationCode.create({
            authorization_code: code.authorizationCode, expires_on: code.expiresAt,
            redirect_url: code.redirectUri, scope: code.scope, clientId: client.id, userId: user.id
        },
        {raw: true}).then(newCode => {
        return {
            authorizationCode: newCode.authorization_code,
            expiresAt: newCode.expires_on,
            redirectUri: newCode.redirect_url,
            scope: newCode.scope,
            client: {id: newCode.clientId},
            user: {id: newCode.userId}
        }
    });
};

module.exports.getAuthorizationCode = (code) => {
    return AuthorizationCode.findOne({where: {authorization_code: code.authorizationCode}})
        .then(result => {
            return {
                code: result.authorization_code,
                authorizationCode: result.authorization_code,
                expiresAt: result.expires_on,
                redirectUri: result.redirect_url,
                scope: result.scope,
                client: {id: result.clientId},
                user: {id: result.userId}
            }
        })
};

module.exports.revokeAuthorizationCode = (code) => {
    AuthorizationCode.destroy({where: {authorization_code: code.code}})
        .then(res => {
            return res
        })
        .catch((err) => {
            return Logger.log('error', err)
        });
};

