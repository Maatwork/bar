const express = require('express');
const router = express.Router();
const Bar = require('../../db/models').Bar;
const Logger = require('../../db/models').Logger;
const User = require('../../db/models').User;
const OAuth2Server = require('express-oauth-server');
const oauth = new OAuth2Server({
    model: require('../../db/models').OAuthModel
});

router.get('/', oauth.authenticate(),  (req, res) => {
    User.findOne({attributes: {exclude: 'password'}, raw: true, include: Bar, where: { id: res.locals.oauth.token.user.id }}).then(result => {
        res.send(result);
    })
});

module.exports = router;
