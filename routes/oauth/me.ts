const express = require('express');
const router = express.Router();
const Bar = require('../../db/foreignkeys').Bar;
const Logger = require('../../models/logger');
const User = require('../../db/foreignkeys').User;
const OAuth2Server = require('express-oauth-server');
const oauth = new OAuth2Server({
    model: require('../../models/oAuthModel')
});

router.get('/', oauth.authenticate({scope:"Jukebox"}),  (req, res) => {
    User.findOne({attributes: {exclude: 'password'}, raw: true, include: Bar, where: { id: res.locals.oauth.token.user.id }}).then(result => {
        res.send(result);
    })
});

module.exports = router;
