const router = require('express').Router();
const app = require('../../app');
const client = require('../../db/models').Client;

router.options('/', function (req, res) {
    res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
    res.send(200);
});

router.post('/', app.oauth.token());

module.exports = router;