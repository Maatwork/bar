const express = require('express');
const router = express.Router();
const bar = require('../models/bar').Bar;
const Logger = require('../models/logger');
const user = require('../models/user');

/* GET clients. */
router.get('/', function(req, res, next) {
    if (req.user) {
        if (req.user.bar_id) {
            bar.findOne({where: { id: req.user.bar_id }})
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
                req.user.bar_id = bar.id;
                user.setUserBar(bar.id, req.user.id, (err, res) => {
                    if (err) return Logger.log('error', err);
                    res.redirect('bar/create');
                })
            })
            .catch(error => Logger.log('error', error))
    }
    });

module.exports = router;