"use strict";
var express = require('express');
var router = express.Router();
var category = require('../../models/category').Category;
var question = require('../../models/question').Question;
var Logger = require('../../models/logger');
/* GET categories. */
router.get('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //  category.hasMany(question);
    require('../../db/foreignkeys').estabilishFKs();
    category.findAll()
        .then(function (categories) { return res.send(categories); })
        .catch(function (error) { return Logger(error); });
    //console.log(q);
    //Logger.log('error', category.getQuestions());
});
/* POST categories */
router.post('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    category.create({ title: req.body.title, description: req.body.description });
});
module.exports = router;
