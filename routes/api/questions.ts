const express = require('express');
const router = express.Router();
const formidable = require('express-formidable');
const question = require('../../db/models').Question;
const Logger = require('../../db/models').Logger;

/* GET questions. */
router.get('/', function(req, res, next) {
    question.findAll().then(questions => {
            res.send(questions);
        }
    )
});

/* GET question. */
router.get('/:questionId', function(req, res, next) {
    question.findAll({where: { quizId: req.params.questionId }})
        .then(question => res.send(question))
        .catch(error => Logger(error))
});

/* POST question to quiz */
router.post('/:quizId', formidable(), (req, res, next) => {
    console.log(req.fields)
    question.create({
        text: req.fields.text,
        media: req.fields.media,
        category: req.fields.category.split(','),
        answer: req.fields.answer,
        duration: req.fields.duration,
        quizId: req.fields.quizId
    }).then((question) => {
        res.status(201).send(question);
    }).catch((error) => {
        console.log(error);
        res.status(400).send(error);
    })
});

router.put('/:questionId', formidable(), (req, res, next) => {
    question.findById(req.fields.questionId)
        .then(question => {
            if (question) {
                question.update({
                    text: req.fields.text,
                    category: req.fields.category.split(','),
                    answer: req.fields.answer,
                    duration: req.fields.duration
                }).then(resultQuestion => res.send(resultQuestion))
                    .catch((error) => {
                    console.log(error);
                        res.status(400).send(error);
                })
            }
        })
});

router.delete('/:questionId', function(req, res, next) {
    question.destroy({where: { id: req.params.questionId }})
        .then(question => res.send(question))
        .catch(error => console.log(error))
});



module.exports = router;


