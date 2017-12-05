const express = require('express');
const formidable = require('express-formidable');
const router = express.Router();
const storage = require('filestorage').create('C:\\uploads-');
const httpStatus = require('http-status-codes');
const quiz = require('../../models/quiz').Quiz;
const question = require('../../models/question').Question;
const Logger = require('../../models/logger');

/* GET quizzes. */
router.get('/', (req, res, next) => {
    require('../../db/foreignkeys').estabilishFKs();
    quiz.findAll()
        .then(quizzes => res.send(quizzes))
        .catch(error => Logger.log('error', error))

    //console.log(q);
    //Logger.log('error', quiz.getQuestions());
});

/* POST quizzes */
router.post('/', formidable(), (req, res, next) => {

    quiz.create({
        title: req.fields.title,
        description: req.fields.description,
        category: req.fields.category,
        image: req.fields.image
    }).then((quiz) => {
        console.log(quiz);
        res.status(httpStatus.CREATED).send(quiz);
    }).catch((error) => {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send(error);
    })
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

router.put('/:quizId', formidable(), (req, res, next) => {

    quiz.findById(req.fields.quizId)
        .then(quiz => {
            if (quiz){
                quiz.update({
                    title: req.fields.title,
                    description: req.fields.description,
                    category: req.fields.category
                }).catch((error) => {
                    console.log(error);
                    res.status(httpStatus.BAD_REQUEST).send(error);
                })
            }
    })
});


module.exports = router;
