var express = require('express');
var router = express.Router();
var user = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('register', { title: 'Register', username: '', password: ''});
});
router.post('/', function(req, res, next) {
    user.saveUser(req.body.username, req.body.password, res)
});

module.exports = router;
