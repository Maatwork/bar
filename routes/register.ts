const express = require('express');
const router = express.Router();
const user = require('../models/user');
const Logger = require('../models/logger');
/* GET consthome page. */
router.get('/', function(req, res, next) {
    res.render('register', { title: 'Register', username: '', password: ''});
});
router.post('/', function(req, res, next) {
    user.saveUser(req.body.username, req.body.password, res, handleRegistration)
});

function handleRegistration(err, username, res)
{
    if (err) {
        Logger.log('error', err);
        res.render('register', {title: 'Register', msg: err, username: username, password: ''})
    } else {
        res.render('index', {title: 'Success'})
    }
}

module.exports = router;
