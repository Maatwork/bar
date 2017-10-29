const express = require('express');
const router = express.Router();
const question = require('../../models/question').Question;
const Logger = require('../../models/logger');

/* GET questions. */
router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    question.findAll().then(questions => {
            res.send(questions);
        }
    )
});

/* GET question. */
router.get('/:questionId', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    question.findAll({where: { categoryId: req.params.questionId }})
        .then(question => res.send(question))
        .catch(error => Logger(error))
});

module.exports = router;


