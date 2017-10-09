var express = require('express');
var router = express.Router();
var user = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('register', { title: 'Register', username: '', password: ''});
});
router.post('/', function(req, res, next) {
    user.saveUser(req.body.username, req.body.password, res, handleRegistration)
});

function handleRegistration(err, username, res)
{
    if (err) {
        console.log(err);
        res.render('register', {title: 'Register', msg: err, username: username, password: ''})
    } else {
        console.log('success!');
        res.render('index', {title: 'Success'})
    }
}

module.exports = router;
