import {hash} from "bcryptjs";

const express = require('express');
const router = express.Router();
const User = require('../models/user').User;
const bcrypt = require('bcryptjs');
const Logger = require('../models/logger');
/* GET consthome page. */
router.get('/', function(req, res, next) {
    res.render('user/register', { title: 'Register', username: '', password: ''});
});
router.post('/', function(req, res, next) {
    if (!req.body.username.trim() || !req.body.password.trim() || !req.body.email.trim()) return res.render('user/register',
        { title: 'Register', username: req.body.username, password: req.body.password, msg: 'Please fill in a username, email and password!'});
    bcrypt.genSalt(14)
        .then((salt) => {
            bcrypt.hash(req.body.password, salt)
                .then(pw => User.create({username: req.body.username, password: pw, email: req.body.email})
                    .then(user => req.login(user, (err) => {
                        if (!err)  return res.redirect('/bar');
                        else Logger.log('error', err);
                    }))
                    .catch(err => {
                        let errorMessage: String = "";
                        err.errors.forEach(e => errorMessage += e.message + ' ')
                        res.render('user/register', {title: 'Register', msg: errorMessage, username: req.body.username, email: req.body.email, password: req.body.password})
                    }))
        })
});

// function handleRegistration(err, user, req, res)
// {
//     if (err) {
//         Logger.log('error', err);
//         res.render('user/register', {title: 'Register', msg: err, username: user.username, password: ''})
//     } else {
//         userModel.getUser(user.username, user.password, (err, user) => {
//             if (err) return Logger.log('error', err);
//             req.login(user, (err) => {
//                 if (!err) {
//                     res.redirect('/bar')
//                 } else Logger.log('error', err);
//             });
//         })
//     }
// }

module.exports = router;
