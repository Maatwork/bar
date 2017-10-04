var express = require('express');
var router = express.Router();
var client = require('../models/client');

/* GET clients. */
router.get('/', function(req, res, next) {
    console.log('callin');
    client.getClients(function(error, result){
        console.log(result.type);
        console.log(result);
        res.render('clients', {title: 'Clients', msg: error, clients: result.rows});
    })
});

module.exports = router;
