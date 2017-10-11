const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const Logger = require('../models/logger');
/* GET consthome page. */
router.get('/', function(req, res, next) {
    res.render('user/register', { title: 'Register', username: '', password: ''});
});
router.post('/', function(req, res, next) {
    if (!req.body.username.trim() || !req.body.password.trim()) return res.render('user/register',
        { title: 'Register', username: req.body.username, password: req.body.password, msg: 'Please fill in a username and password!'});
    userModel.saveUser(req.body.username, req.body.password, req, res, handleRegistration)
});

function handleRegistration(err, user, req, res)
{
    if (err) {
        Logger.log('error', err);
        res.render('user/register', {title: 'Register', msg: err, username: user.username, password: ''})
    } else {
        userModel.getUser(user.username, user.password, (err, user) => {
            if (err) return Logger.log('error', err);
            req.login(user, (err) => {
                if (!err) {
                    res.redirect('/bar')
                } else Logger.log('error', err);
            });
        })
    }
}

module.exports = router;
