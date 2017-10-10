var express = require('express');
var router = express.Router();
var category = require('../models/category');

/* GET categories. */
router.get('/', function(req, res, next) {
    category.getCategories(function(error, result){
        res.render('category', {title: 'Category', msg: error, categories: result.rows});
    })
});

module.exports = router;
