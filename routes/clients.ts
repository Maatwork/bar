var express = require('express');
var router = express.Router();
var client = require('../models/client');

/* GET clients. */
router.get('/', function(req, res, next) {
    if (req.user && req.user.isadmin) {
        client.getClients(function(error, result){
            res.render('oauth/clients', {title: 'Clients', msg: error, clients: result.rows});
        })
    } else {
        req.session.redirectTo = req.originalUrl;
        res.redirect('/login');
    }
});

/* POST client. */
router.post('/', function(req, res, next) {
    if (req.user && req.user.isadmin) {
        client.saveClient(req.body.clientId, req.body.redirectURL, function(error, result){
            res.render('oauth/clients', {title: 'Clients', msg: error, clients: result.rows});
        })
    } else {
        req.session.redirectTo = req.originalUrl;
        res.redirect('/login');
    }

});

module.exports = router;
