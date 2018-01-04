const router = require('express').Router();

let passport = require('passport');


/* GET login page. */
router.get('/', function (req, res) {
    res.render('user/login', {msg: '', title: 'Login', username: ''});
});

router.post('/', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.render('user/login', {msg: info.message, title: 'Login', username: info.username})
        }
        req.login(user, err => {
            if (err) return next(err);
            let redirectURL = '/';
            if (req.session.redirectTo) redirectURL = req.session.redirectTo;
            req.session.redirectTo = null;
            res.redirect(redirectURL);
        });
    })(req, res, next);
});

module.exports = router;