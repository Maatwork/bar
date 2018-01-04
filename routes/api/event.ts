const express = require('express');
const router = express.Router();
const event = require('../../db/models').Event;
const bar = require('../../db/models').Bar;
const user = require('../../db/models').User;
const Op = require('sequelize').Op;
const Logger = require('../../db/models').Logger;
const OAuth2Server = require('express-oauth-server');
const oauth = new OAuth2Server({
    model: require('../../db/models').OAuthModel
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

router.delete('/:eventId', oauth.authenticate({scope: "bar"}), (req, res) => {
    if (!req.params.eventId) return res.sendStatus(400);
    user.findOne({where: {id: res.locals.oauth.token.user.id}})
        .then(barOwner => {
            if (!barOwner.barId) return res.status(400).send('mek bar');
            if (barOwner.isadmin) {
                return event.destroy({where: {id: req.params.eventId}})
                    .then(deleted => res.send({deleted}));
            }
            return event.findOne({where: {barId: barOwner.barId, id: req.params.eventId}})
                .then(foundEvent => {
                    if (!foundEvent) return res.status(400).send('invalid event for this bar');
                    foundEvent.destroy().then(destroyed => res.send(destroyed));
                })
        }).catch(err => {
        Logger.log('error', err);
        res.status(400).send(err);
    });
});


router.post('/', oauth.authenticate({scope:"bar"}), function(req, res) {
    let condition: any = {userId: res.locals.oauth.token.user.id};
    if (req.query.barId) condition.id = req.query.barId;
    bar.findOne({where: condition})
        .then(foo =>
            foo.createEvent({
                name: req.body.name,
                description: req.body.description,
                start: req.body.start,
                end: req.body.end
            })
                .then(event => {
                    res.status(201).send(event);
                }))
        .catch(error => console.log(error));
});

router.put('/:eventId', oauth.authenticate({scope: "bar"}), function (req, res) {
    if (!req.params.eventId) return res.status(400).send('supply event id');
    let condition: any = {userId: res.locals.oauth.token.user.id};
    if (req.query.barId) condition.id = req.query.barId;

    bar.findOne({where: condition}).then(bar => {
        user.findOne({where: {id: res.locals.oauth.token.user.id}})
            .then(barOwner => {
                return barOwner
            })
            .then(owner => {
                let condition = {where: {id: req.params.eventId}};
                if (!owner.isadmin) condition.barId = {[Op.not]: bar.id};
                event.findOne(condition)
                    .then(evt => {
                        console.log(evt);
                        if (evt && !owner.isadmin) return res.status(401).send('not yer damn bar');
                        let values = req.body;
                        values.id = req.params.eventId;
                        event.upsert(
                            values
                        ).then(result => res.send(result))
                    })
            })
            .catch(error => res.status(400).send(error));
    });
});

module.exports = router;
