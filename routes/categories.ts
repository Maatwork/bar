var express = require('express');
var router = express.Router();
var category = require('../models/category');

/* GET categories. */
router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3006");
    category.getCategories(function(error, result){
        //res.render('category', {title: 'Category', msg: error, categories: result.rows});
        res.send(result);
    })
});

module.exports = router;
