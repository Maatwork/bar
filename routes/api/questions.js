"use strict";
var express = require('express');
var router = express.Router();
var formidable = require('express-formidable');
var question = require('../../models/question').Question;
var Logger = require('../../models/logger');
var httpStatus = require('http-status-codes');
/* GET questions. */
router.get('/', function (req, res, next) {
    question.findAll().then(function (questions) {
        res.send(questions);
    });
});
/* GET question. */
router.get('/:questionId', function (req, res, next) {
    question.findAll({ where: { quizId: req.params.questionId } })
        .then(function (question) { return res.send(question); })
        .catch(function (error) { return Logger(error); });
});
/* POST question to quiz */
router.post('/:quizId', formidable(), function (req, res, next) {
    if (req.files["file"]) {
        storage.insert('image', req.files["file"].path, function (err, id, stat) {
            console.log(id);
            console.log('test');
            question.create({
                text: req.fields.text,
                media: id.toString(),
                category: req.fields.category.split(','),
                answer: req.fields.answer,
                duration: req.fields.answer,
                quizId: req.fields.quizId
            }).then(function (quiz) {
                res.status(httpStatus.CREATED).send(quiz);
            }).catch(function (error) { return Logger.log(error); });
        });
    }
    question.create({
        text: req.fields.text,
        category: req.fields.category.split(','),
        answer: req.fields.answer,
        duration: req.fields.duration,
        quizId: req.fields.quizId
    }).then(function (question) {
        res.status(httpStatus.CREATED).send(question);
    }).catch(function (error) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send(error);
    });
});
router.put('/:questionId', formidable(), function (req, res, next) {
    question.findById(req.fields.questionId)
        .then(function (question) {
        if (question) {
            question.update({
                text: req.fields.text,
                category: req.fields.category.split(','),
                answer: req.fields.answer,
                duration: req.fields.duration
            }).catch(function (error) {
                console.log(error);
                res.status(httpStatus.BAD_REQUEST).send(error);
            });
        }
    });
});
router.delete('/:questionId', function (req, res, next) {
    question.destroy({ where: { id: req.params.questionId } })
        .then(function (question) { return res.send(question); })
        .catch(function (error) { return console.log(error); });
});
module.exports = router;
