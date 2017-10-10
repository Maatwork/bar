var express = require('express');
var router = express.Router();
var client = require('../models/client');

/* GET clients. */
router.get('/', function(req, res, next) {
    client.getClients(function(error, result){
        res.render('oauth/clients', {title: 'Clients', msg: error, clients: result.rows});
    })
});

/* POST client. */
router.post('/', function(req, res, next) {
    client.saveClient(req.body.clientId, req.body.redirectURL, function(error, result){
        res.render('oauth/clients', {title: 'Clients', msg: error, clients: result.rows});
    })
});

module.exports = router;
