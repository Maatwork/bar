import {where} from "sequelize";

const express = require('express');
const router = express.Router();
const user = require('../../db/models').User;
const bar = require('../../db/models').Bar;
const event = require('../../db/models').Event;
const Logger = require('../../db/models').Logger;
const OAuth2Server = require('express-oauth-server');
const oauth = new OAuth2Server({
    model: require('../../db/models').OAuthModel
});

router.get('/', (req, res) => {
    let condition = {};
    if (req.query.city) condition.city = req.query.city;
    if (req.query.userId) condition.userId = req.query.userId;
    bar.findAll({where: condition, raw: true}).then(bars => {
        res.send(bars);
    })
});

router.get('/:barId', (req, res) => {
    if (!req.params.barId) return res.sendStatus(400);

    bar.findOne({where: {id: req.params.barId}, include: event})
        .then(bar => res.send(bar))
        .catch(err => Logger.log('error', err))
});

router.get('/:city', (req, res) => {
    if (!req.params.city) return res.sendStatus(400);

    bar.findAll({where: {city: req.params.city}})
        .then(bars => {
            res.send(bars);
        })
});

/* POST bar. */
router.post('/', oauth.authenticate({scope:"bar"}), function(req, res) {
    //dit is een boolean
    let errorMessage: String = '';
    if (!req.body.name) errorMessage += 'Please fill in your bar name';
    if (!req.body.description) errorMessage ? errorMessage += ', bar description' : errorMessage = 'Please fill in your bar description';
    if (!req.body.city) errorMessage ? errorMessage += ' , city' : errorMessage = 'Please fill in the city of your bar';
    if (!req.body.zipcode) errorMessage ? errorMessage += ' , zipcode' : errorMessage = 'Please fill in your zipcode';
    if (!req.body.address) errorMessage ? errorMessage += ' and address ' : errorMessage = 'Please fill in your address';
    if (errorMessage) {
        errorMessage += '.';
        res.status(400).send(errorMessage);
    } else {
        bar.create({
            name: req.body.name,
            description: req.body.description,
            city: req.body.city,
            zipcode: req.body.zipcode,
            address: req.body.address,
            photos: JSON.parse(req.body.photos),
            userId: res.locals.oauth.token.user.id
        })
            .then(newBar => res.status(201).send(newBar))
            .catch(error => console.log(error));
    }
});

/* PATCH bar. */
router.patch('/:barId', oauth.authenticate({scope: "bar"}), function (req, res) {
    if (!req.params.barId) return res.sendStatus(401).send('Please fill in a bar ID');

    bar.findOne({where: {id: req.params.barId}})
        .then(bar => {
            if (bar.userId != res.locals.oauth.token.user.id) return Promise.reject('Not the bar owner.');
            return bar;
        })
        .then(myBar => {
            delete(req.body.userId);
            if (req.body.photos) req.body.photos = JSON.parse(req.body.photos);
            return myBar.update(req.body);
        })
        .then(resultBar => (res.send(resultBar)))
        .catch(err => console.log(err));
});

module.exports = router;
