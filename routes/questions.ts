var express = require('express');
var router = express.Router();
var question = require('../models/question');

/* GET questions. */
router.get('/', function(req, res, next) {
    question.getQuestion(function(error, result){
        res.render('questions', {title: 'Questions', msg: error, questions: result.rows});
    })
});

module.exports = router;
