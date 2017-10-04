var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('authorize', { title: 'Authorize' });
});

module.exports = router;
