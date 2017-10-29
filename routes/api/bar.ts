const express = require('express');
const router = express.Router();
const bar = require('../../models/bar').Bar;
const Logger = require('../../models/logger');
const user = require('../../models/user');
const OAuth2Server = require('express-oauth-server');
const oauth = new OAuth2Server({
    model: require('../../db/database')
});

router.get('/', (req, res) => {
   bar.findAll({raw: true}).then(bars => {
       res.send(bars);
   })
});
/* POST bar. */
router.post('/', oauth.authenticate({scope:"bar"}), function(req, res) {
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
                User.update({barId: bar.id}, {where: {id: req.user.id}})
                    .then(res.redirect('bar'))
            })
            .catch(error => res.send(error.errors[0].message))
    }
});

module.exports = router;