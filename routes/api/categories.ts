var express = require('express');
var router = express.Router();
var category = require('../../models/category').Category;
const question = require('../../models/question').Question;
const Logger = require('../../models/logger');

/* GET categories. */
router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
  //  category.hasMany(question);
    require('../../db/foreignkeys').estabilishFKs();
    category.findAll()
        .then(categories => res.send(categories))
        .catch(error => Logger(error))

    //console.log(q);
    //Logger.log('error', category.getQuestions());
});

/* POST categories */
router.post('/', function (req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    category.create({ title: req.body.title ,description: req.body.description});
})

module.exports = router;
