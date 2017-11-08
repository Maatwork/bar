var express = require('express');
var router = express.Router();
var quiz = require('../../models/qui').Quiz;
const question = require('../../models/question').Question;
const Logger = require('../../models/logger');

/* GET quizzes. */
router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
  //  quiz.hasMany(question);
    require('../../db/foreignkeys').estabilishFKs();
    quiz.findAll()
        .then(quizzes => res.send(quizzes))
        .catch(error => Logger(error))

    //console.log(q);
    //Logger.log('error', quiz.getQuestions());
});

/* POST quizzes */
router.post('/', function (req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    quiz.create({ title: req.body.title ,description: req.body.description})
        .catch(error => Logger(error))
})

module.exports = router;
