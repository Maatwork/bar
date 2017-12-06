"use strict";
var express = require('express');
var router = express.Router();
var Bar = require('../../db/foreignkeys').Bar;
var Logger = require('../../models/logger');
var User = require('../../db/foreignkeys').User;
var OAuth2Server = require('express-oauth-server');
var oauth = new OAuth2Server({
    model: require('../../models/oAuthModel')
});
router.get('/', oauth.authenticate(), function (req, res) {
    User.findOne({ attributes: { exclude: 'password' }, raw: true, include: Bar, where: { id: res.locals.oauth.token.user.id } }).then(function (result) {
        res.send(result);
    });
});
module.exports = router;
//# sourceMappingURL=me.js.map