const express = require('express');
const router = express.Router();
const bar = require('../../db/foreignkeys').Bar;
const event = require('../../db/foreignkeys').Event;
const Logger = require('../../models/logger');
const user = require('../../models/user');
const OAuth2Server = require('express-oauth-server');
const oauth = new OAuth2Server({
    model: require('../../models/oAuthModel')
});

router.get('/', (req, res) => {
   bar.findAll({raw: true}).then(bars => {
       res.send(bars);
   })
});

router.get('/:barId', (req, res) => {
    if (!req.params.barId) return res.sendStatus(400);

    bar.findOne({where: {id: req.params.barId}, include: event})
        .then(bar => res.send(bar))
        .catch(err => Logger.log('error', err))
});

/* POST bar. */
router.post('/', oauth.authenticate({scope:"bar"}), function(req, res) {
    let errorMessage: String = '';
    if (!req.body.name) errorMessage += 'Please fill in your bar name';
    if (!req.body.description) errorMessage ? errorMessage += ', bar description' : errorMessage = 'Please fill in your bar description';
    if (!req.body.city) errorMessage ? errorMessage += ' , city' : errorMessage = 'Please fill in the city of your bar';
    if (!req.body.zipcode) errorMessage ? errorMessage += ' , zipcode' : errorMessage = 'Please fill in your zipcode';
    if (!req.body.address) errorMessage ? errorMessage += ' and address ' : errorMessage = 'Please fill in your address';
    if (errorMessage) {
        errorMessage += '.';
        res.send(errorMessage);
    } else {

            bar.create({ name: req.body.name, description: req.body.description, city: req.body.city, zipcode: req.body.zipcode, address: req.body.address, photos: JSON.parse(req.body.photos) })
                .then(bar => {
                    User.update({barId: bar.id}, {where: {id: res.locals.oauth.token.user.id}})
                        .then(res.redirect('bar'))
                })
                .catch(error => res.send(error))
        }
});

module.exports = router;
