const express = require('express');
const router = express.Router();
const event = require('../../db/foreignkeys').Event;
const bar = require('../../db/foreignkeys').Bar;
const user = require('../../db/foreignkeys').User;
const Logger = require('../../models/logger');
const OAuth2Server = require('express-oauth-server');
const oauth = new OAuth2Server({
    model: require('../../models/oAuthModel')
});

router.get('/', (req, res) => {
    let condition = {};
    let includeCondition = {};
    let limit = 100;
    let offset = 0;

    if (req.query.barId) condition = {barId: req.query.barId};
    if (req.query.city) includeCondition = {city: req.query.city};
    if (req.query.limit) limit = req.query.limit;
    if (req.query.offset) offset = req.query.offset;
    if (req.query.start) condition.start = req.query.start;

    event.findAll({raw: true, where: condition, include: {model: bar, where: includeCondition}, limit: limit, offset: offset}).then(events => {
       res.send(events);
   })
        .catch(err => res.status(500).send(err));
});

router.get('/:eventId', (req, res) => {
    if (!req.params.eventId) return res.sendStatus(400);

    event.findOne({where: {id: req.params.eventId}})
        .then(event => res.send(event))
        .catch(err => {
            Logger.log('error', err);
            res.status(400).send(err);
        })
});

router.post('/', oauth.authenticate({scope:"bar"}), function(req, res) {
    user.findOne({where: {id: res.locals.oauth.token.user.id}})
        .then(barOwner => {
            if (!barOwner.barId) return res.status(400).send('mek bar');
            return barOwner;
        })
        .then(owner => {
            return bar.findOne({where: {id: owner.barId}})
        })
        .then(foo =>
            foo.createEvent({
                name: req.body.name,
                description: req.body.description,
                start: req.body.start,
                end: req.body.end
            })
                .then(event => {
                    res.send(event);
                }))
        .catch(error => res.status(400).send(error));
});

module.exports = router;
