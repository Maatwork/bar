const express = require('express');
const router = express.Router();
const bar = require('../models/bar').Bar;
const Logger = require('../models/logger');
const User = require('../models/user').User;

/* GET bars. */
router.get('/', function(req, res, next) {
    if (req.user) {
        if (req.user.barId) {
            bar.findOne({where: { id: req.user.barId }})
                .then(bar => res.send(bar))
                .catch(error => Logger(error))
        } else {
            res.render('bar/create', { title: 'Create a bar' });
        }
    } else {
        req.session.redirectTo = req.originalUrl;
        res.redirect('/login');
    }
});

/* POST bar. */
router.post('/', function(req, res, next) {
    if (!req.user) {
        req.session.redirectTo = req.originalUrl;
        return res.redirect('/login');
    }
    let errorMessage: String = '';
    if (!req.body.name) errorMessage += 'Please fill in your bar name';
    if (!req.body.description) errorMessage ? errorMessage += ', bar description' : errorMessage = 'Please fill in your bar description';
    if (!req.body.location) errorMessage ? errorMessage += ' and address' : errorMessage = 'Please fill in your bar address';
    if (errorMessage) {
        errorMessage += '.';
        res.render('bar/create', { title: 'Create a bar', msg: errorMessage, name: req.body.name, description: req.body.description, location: req.body.location })
    } else {
        bar.create({ name: req.body.name, description: req.body.description, location: req.body.location })
            .then(bar => {
                req.user.barId = bar.id;
                User.update({barId: bar.id}, {where: {id: req.user.id}})
                    .then(res.redirect('bar'))
            })
            .catch(error => res.render('bar/create', { title: 'Create a bar', msg: error.errors[0].message}))
    }
    });

module.exports = router;