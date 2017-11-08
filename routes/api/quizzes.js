"use strict";
var express = require('express');
var router = express.Router();
var quiz = require('../../models/qui').Quiz;
var question = require('../../models/question').Question;
var Logger = require('../../models/logger');
/* GET quizzes. */
router.get('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //  quiz.hasMany(question);
    require('../../db/foreignkeys').estabilishFKs();
    quiz.findAll()
        .then(function (quizzes) { return res.send(quizzes); })
        .catch(function (error) { return Logger(error); });
    //console.log(q);
    //Logger.log('error', quiz.getQuestions());
});
/* POST quizzes */
router.post('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    quiz.create({ title: req.body.title, description: req.body.description })
        .catch(function (error) { return Logger(error); });
});
module.exports = router;
