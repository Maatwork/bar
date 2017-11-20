const express = require('express');
const router = express.Router();
const event = require('../../db/foreignkeys').Event;
const bar = require('../../db/foreignkeys').Bar;
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
       .catch(err => res.sendStatus(500).send(err));
});

router.get('/:eventId', (req, res) => {
    if (!req.params.eventId) return res.sendStatus(400);

    event.findOne({where: {id: req.params.eventId}})
        .then(event => res.send(event))
        .catch(err => {
            Logger.log('error', err);
            res.sendStatus(500).send(err);
        })
});

router.post('/', oauth.authenticate({scope:"bar"}), function(req, res) {
            event.create({ name: req.body.name, description: req.body.description, start: req.body.start, end: req.body.end })
                .then(event => {
                    res.send(event);
                })
                .catch(error => res.sendStatus(500).send(error))
});

module.exports = router;
