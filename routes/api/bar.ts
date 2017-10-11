const express = require('express');
const router = express.Router();
const bar = require('../../models/bar').Bar;
const Logger = require('../../models/logger');
const user = require('../../models/user');

/* POST bar. */
router.post('/', function(req, res, next) {
    let errorMessage: String = '';
    if (!req.body.name) errorMessage += 'Please fill in your bar name';
    if (!req.body.description) errorMessage ? errorMessage += ', bar description' : errorMessage = 'Please fill in your bar description';
    if (!req.body.location) errorMessage ? errorMessage += ' and address' : errorMessage = 'Please fill in your bar address';
    if (errorMessage) {
        errorMessage += '.';
        res.send(errorMessage);
    } else {
        bar.create({ name: req.body.name, description: req.body.description, location: req.body.location })
            .then(bar => {
                user.setUserBar(bar.id, req.body.user.id, (err, res) => {
                    if (err) return Logger.log('error', err);
                    res.send(bar);
                })
            })
            .catch(error => Logger.log('error', error))
    }
});

module.exports = router;