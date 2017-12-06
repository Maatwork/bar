"use strict";
var express = require('express');
var router = express.Router();
var event = require('../../db/foreignkeys').Event;
var bar = require('../../db/foreignkeys').Bar;
var user = require('../../db/foreignkeys').User;
var Op = require('sequelize').Op;
var Logger = require('../../models/logger');
var OAuth2Server = require('express-oauth-server');
var oauth = new OAuth2Server({
    model: require('../../models/oAuthModel')
});
router.get('/', function (req, res) {
    var condition = {};
    var includeCondition = {};
    var limit = 100;
    var offset = 0;
    if (req.query.barId)
        condition = { barId: req.query.barId };
    if (req.query.city)
        includeCondition = { city: req.query.city };
    if (req.query.limit)
        limit = req.query.limit;
    if (req.query.offset)
        offset = req.query.offset;
    if (req.query.start)
        condition.start = req.query.start;
    event.findAll({ raw: true, where: condition, include: { model: bar, where: includeCondition }, limit: limit, offset: offset }).then(function (events) {
        res.send(events);
    })
        .catch(function (err) { return res.status(500).send(err); });
});
router.get('/:eventId', function (req, res) {
    if (!req.params.eventId)
        return res.sendStatus(400);
    event.findOne({ where: { id: req.params.eventId } })
        .then(function (event) { return res.send(event); })
        .catch(function (err) {
        Logger.log('error', err);
        res.status(400).send(err);
    });
});
router.delete('/:eventId', oauth.authenticate({ scope: "bar" }), function (req, res) {
    if (!req.params.eventId)
        return res.sendStatus(400);
    user.findOne({ where: { id: res.locals.oauth.token.user.id } })
        .then(function (barOwner) {
        if (!barOwner.barId)
            return res.status(400).send('mek bar');
        if (barOwner.isadmin) {
            return event.destroy({ where: { id: req.params.eventId } })
                .then(function (deleted) { return res.send({ deleted: deleted }); });
        }
        return event.findOne({ where: { barId: barOwner.barId, id: req.params.eventId } })
            .then(function (foundEvent) {
            if (!foundEvent)
                return res.status(400).send('invalid event for this bar');
            foundEvent.destroy().then(function (destroyed) { return res.send(destroyed); });
        });
    }).catch(function (err) {
        Logger.log('error', err);
        res.status(400).send(err);
    });
});
router.post('/', oauth.authenticate({ scope: "bar" }), function (req, res) {
    user.findOne({ where: { id: res.locals.oauth.token.user.id } })
        .then(function (barOwner) {
        if (!barOwner.barId)
            return res.status(400).send('mek bar');
        return barOwner;
    })
        .then(function (owner) {
        return bar.findOne({ where: { id: owner.barId } });
    })
        .then(function (foo) {
        return foo.createEvent({
            name: req.body.name,
            description: req.body.description,
            start: req.body.start,
            end: req.body.end
        })
            .then(function (event) {
            res.send(event);
        });
    })
        .catch(function (error) { return res.status(400).send(error); });
});
router.put('/:eventId', oauth.authenticate({ scope: "bar" }), function (req, res) {
    if (!req.params.eventId)
        return res.status(400).send('supply event id');
    user.findOne({ where: { id: res.locals.oauth.token.user.id } })
        .then(function (barOwner) {
        if (!barOwner.barId)
            return res.status(400).send('mek bar');
        return barOwner;
    })
        .then(function (owner) {
        var condition = { where: { id: req.params.eventId } };
        if (!owner.isadmin)
            condition.barId = (_a = {}, _a[Op.not] = owner.barId, _a);
        event.findOne(condition)
            .then(function (evt) {
            console.log(evt);
            if (evt && !owner.isadmin)
                return res.status(401).send('not yer damn bar');
            var values = req.body;
            values.id = req.params.eventId;
            event.upsert(values).then(function (result) { return res.send(result); });
        });
        var _a;
    })
        .catch(function (error) { return res.status(400).send(error); });
});
module.exports = router;
