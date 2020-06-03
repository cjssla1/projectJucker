module.exports = function (app) {

    var authData = {
        id: 'hi',
        password: '1234',
        nickname: 'gyeong'
      };

    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        done(null, authData);
    });

    passport.use(new LocalStrategy({
            usernameField: 'id',
            passwordField: 'password'
        },
        function (username, password, done) {
            if (username === authData.id) {
                if (password === authData.password) {
                    return done(null, authData, {
                        message: 'Welcome.'
                    });
                } else {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
            } else {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
        }
    ));

    return passport;
}