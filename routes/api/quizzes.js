"use strict";
var express = require('express');
var formidable = require('express-formidable');
var router = express.Router();
var storage = require('filestorage').create('C:\\uploads-');
var httpStatus = require('http-status-codes');
var quiz = require('../../models/quiz').Quiz;
var question = require('../../models/question').Question;
var Logger = require('../../models/logger');
/* GET quizzes. */
router.get('/', function (req, res, next) {
    require('../../db/foreignkeys').estabilishFKs();
    quiz.findAll()
        .then(function (quizzes) { return res.send(quizzes); })
        .catch(function (error) { return Logger.log('error', error); });
    //console.log(q);
    //Logger.log('error', quiz.getQuestions());
});
/* POST quizzes */
router.post('/', formidable(), function (req, res, next) {
    quiz.create({
        title: req.fields.title,
        description: req.fields.description,
        category: req.fields.category,
        image: req.fields.image
    }).then(function (quiz) {
        console.log(quiz);
        res.status(httpStatus.CREATED).send(quiz);
    }).catch(function (error) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send(error);
    });
    /*
     if (req.files["image"]) {

         storage.insert('image', req.files["image"].path, function(err, id, stat) {
             console.log(id);
             console.log('test');
             quiz.create({title: req.fields.title, description: req.fields.description, category: req.fields.category, image: id.toString()})
                .catch(error => console.log(error))
     });
     }else{
        quiz.create({title: req.fields.title, description: req.fields.description, category: req.fields.category})
            .catch(error => console.log(error))
     }*/
});
router.put('/:quizId', formidable(), function (req, res, next) {
    quiz.findById(req.fields.quizId)
        .then(function (quiz) {
        if (quiz) {
            quiz.update({
                title: req.fields.title,
                description: req.fields.description,
                category: req.fields.category
            }).catch(function (error) {
                console.log(error);
                res.status(httpStatus.BAD_REQUEST).send(error);
            });
        }
    });
});
module.exports = router;
