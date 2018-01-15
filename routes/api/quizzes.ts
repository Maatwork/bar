const express = require('express');
const formidable = require('express-formidable');
const router = express.Router();
const quiz = require('../../db/models').Quiz;
const Logger = require('../../db/models').Question;

/* GET quizzes. */
router.get('/', (req, res, next) => {
    require('../../db/foreignkeys').estabilishFKs();
    quiz.findAll()
        .then(quizzes => res.send(quizzes))
        .catch(error => Logger.log('error', error))
});

/* POST quizzes */
router.post('/', formidable(), (req, res, next) => {

    quiz.create({
        title: req.fields.title,
        description: req.fields.description,
        category: req.fields.category,
        image: req.fields.image
    }).then((quiz) => {
        res.status(201).send(quiz);
    }).catch((error) => {
        console.log(error);
        res.status(400).send(error);
    })
});

router.put('/:quizId', formidable(), (req, res, next) => {

    quiz.findById(req.fields.quizId)
        .then(quiz => {
            if (quiz){
                quiz.update({
                    title: req.fields.title,
                    description: req.fields.description,
                    category: req.fields.category
                }).then(resultQuiz => res.send(resultQuiz))
                    .catch((error) => {
                    console.log(error);
                    res.status(401).send(error);
                })
            }
    })
});


module.exports = router;
