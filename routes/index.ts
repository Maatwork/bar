var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var OAuthServer = require('express-oauth-server');

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', {title: 'Maatwerk werkt niet'});
});

module.exports = router;
