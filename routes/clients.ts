const express = require('express');
const router = express.Router();
const Client = require('../db/models').Client;

const Logger = require('../db/models').Logger;

/* GET clients. */
router.get('/', function(req, res, next) {
    if (req.user && req.user.isadmin) {
        Client.findAll().then((clients: any) => {
            res.render('oauth/clients', {title: 'Clients', msg: '', clients: clients});
        }).catch((error: any) => Logger.log('error', error))
    } else {
        req.session.redirectTo = req.originalUrl;
        res.redirect('/login');
    }
});

/* POST client. */
router.post('/', function(req, res, next) {
    if (req.user && req.user.isadmin) {
        Client.create({id: req.body.clientId, redirect_url: req.body.redirectURL}, {raw: true}).then((client: any) => {
            res.render('oauth/clients', {title: 'Clients', msg: '', clients: [client]});
        }).catch((error: any) => {
            res.render('oauth/clients', {title: 'Clients', msg: error, clients: undefined});
        });
    } else {
        req.session.redirectTo = req.originalUrl;
        res.redirect('/login');
    }

});

module.exports = router;
