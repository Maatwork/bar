"use strict";
var express = require('express');
var router = express.Router();
var question = require('../../models/question').Question;
var Logger = require('../../models/logger');
/* GET questions. */
router.get('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    question.findAll().then(function (questions) {
        res.send(questions);
    });
});
/* GET question. */
router.get('/:questionId', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    question.findAll({ where: { categoryId: req.params.questionId } })
        .then(function (question) { return res.send(question); })
        //.catch(function (error) { return Logger(error); });
});
module.exports = router;
