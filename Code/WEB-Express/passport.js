

module.exports = function (app,db) {

    var authData ={
        nickname:null
    }

    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user.nickname);
    });

    passport.deserializeUser(function (id, done) {
        done(null, authData);
    });

    passport.use(new LocalStrategy({
            usernameField: 'id',
            passwordField: 'password'
        },
        async function (username, password, done) {
            const sel = await db.execute(`SELECT id, pwd FROM customer WHERE id = ?`,[username])
            
            if(sel[0][0] != undefined){
                authData.nickname = sel[0][0].id
                if(password === sel[0][0].pwd){
                    return done(null, authData, {
                        message: 'Welcome.'
                    });
                }else{
                    return done(null, false, {
                        message: '잘못된 비밀번호입니다.'
                    });
                }
            }else{
                return done(null,false,{
                    message: '없는 아이디입니다.'
                });
            }
        }
    ));

    return passport;
}