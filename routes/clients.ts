var express = require('express');
var router = express.Router();
var client = require('../models/client');

/* GET clients. */
router.get('/', function(req, res, next) {
    client.getClients(function(error, result){
        console.log(result.type);
        console.log(result);
        res.render('clients', {title: 'Clients', msg: error, clients: result.rows});
    })
});

/* POST client. */
router.post('/', function(req, res, next) {
    console.log('calling saveClient');
    console.log(req);
    client.saveClient(req.body.clientId, req.body.redirectURL, function(error, result){
        console.log(result.type);
        console.log(result);
        console.log(result.rows);
        res.render('clients', {title: 'Clients', msg: error, clients: result.rows});
    })
});

module.exports = router;
