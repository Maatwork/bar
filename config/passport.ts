const LocalStrategy = require('passport-local').Strategy;
const User = require('../db/models').User;

module.exports = (passport) => {
    passport.use(new LocalStrategy((username: String, password: String, callback: Function) => {
        let bcrypt = require('bcryptjs');
        User.findOne({where: {username: username}}, {raw: true}).then(user => {
            if (!user) {
                return callback(null, false, {message: 'User does not exist', username: ''});
            }
            bcrypt.compare(password, user.password)
                .then(res => {
                    if (!res) return callback(null, false, {message: 'Password is incorrect', username: username});
                    return callback(null, user);
                });
        });
    }));

    passport.serializeUser(function (user, callback) {
        callback(null, user.id);
    });

    passport.deserializeUser(function (id, callback) {
        User.findOne({where: {id: id}}).then(user => {
            if (user) {
                return callback(null, user)
            } else {
                callback(false, false);
            }
        });
    });

};