const express = require('express'); //express 모듀ퟝ 요청
const ejs = require("ejs"); // ejs 모듈 요청
const app = express();  // app을 express 프레임워크로 킨다
const bodyParser = require('body-parser');
const mysql = require("mysql");
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const KakaoStrategy = require("passport-kakao").Strategy;
const NaverStrategy = require("passport-naver").Strategy;



const client = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "3946",
    database: "mydb"
});


//client.connect();
//client.query('select name, current from stock;', function(err, rows, fields){
//    if (err) throw err;
//    console.log(rows[0].name);
//});

app.set("view engine", "ejs");  // app에 view engine을 설치, ejs를 템플릿으로
app.use(express.static(__dirname + '/')); // views 폴더 경로는 프로젝트 폴더.(__dirname이 폴더 위치)
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    key: 'sid',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 10 //10분
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res){
    let session = req.session;
    //console.log(req.user[0].email);
    //console.log(req.user[0]);
    //console.log(session);
    //console.log(session.passport.user[0].email);
    console.log(session.email);
    client.query("select name, current, aggregate, tran, updown from stock where date_format(day, '%Y-%m-%d') = date_format(now(), '%Y-%m-%d') order by aggregate DESC limit 10;", function(err, result, fields){
        if (err){
            console.log(err + "error1");
        }
        else {
            client.query("select name, updown from stock where updown >= 5 and date_format(day, '%Y-%m-%d') = date_format(now(), '%Y-%m-%d') order by updown DESC limit 10;", function(err, result2, fields){
                if (err){
                    console.log("중첩에러");
                }
                else{
                    client.query("select idx, title, cnt_comment from board where likeno >= 3 order by idx DESC limit 10;", function(err, result3, fields) {
                        if(err){
                            console.log(err);
                        }
                        else {
                            res.render("main", {
                                results: result, //실시간 주가 정보
                                results2: result2, // 급등 종목 정보
                                results3: result3,
                                session: session
                            });
                        }
                    })
                }
            });
            
            //res.render("main", {
            //    results: result
            //});
        }
    });
})

app.post('/', function(req, res) {
    var Vname = req.body.stock_name;
    //console.log('POST Para = ' + Vname);
    client.query("select current, (abs(current - low)/low) * 100 as rate from stock where name = ? and date_format(day, '%Y-%m-%d') = date_format(now(), '%Y-%m-%d')", [Vname], function(err, result, fieldds){
        if (err){
            console.log("err");
        }
        else {
            var Vprice = result[0].current;
            var Vrate = result[0].rate;
            var arr = new Array(Vname, Vprice, Vrate);
            console.log(arr);
            res.send({result:arr});
        }
    })
    //console.log("zz"+Vname);
    //res.send({result:Vname})

})

app.get('/board', function (req, res){
    console.log("hello");
    let session = req.session;
    
    client.query("select *, date_format(date, '%H:%i') as time from board order by idx desc limit 0,10;", function(err, result, fields){
        if (err){
            console.log("error2");
        }
        else {
            client.query("select board_idx, count(*) AS cnt from comment group by board_idx;", function(err, result2, fields){
                if (err){
                    console.log("error2");
                }
                else{
                    res.render("board", {
                        results: result,
                        results2: result2,
                        session: session
                    });
                }
            })
            //res.render("board", {
            //    results: result
            //});
        }
    });
})

app.get('/recommend-board', function (req, res){
    console.log("hello");
    let session = req.session;
    
    client.query("select *, date_format(date, '%H:%i') as time from board where likeno >= 3 order by idx desc limit 0,10;", function(err, result, fields){
        if (err){
            console.log(err);
        }
        else {
            client.query("select board_idx, count(*) AS cnt from comment group by board_idx;", function(err, result2, fields){
                if (err){
                    console.log("error2");
                }
                else{
                    res.render("recommend-board", {
                        results: result,
                        results2: result2,
                        session: session
                    });
                }
            })
            //res.render("board", {
            //    results: result
            //});
        }
    });
})

app.get('/view/:idx', function(req, res){
    console.log(req.params.idx);
    let session = req.session;
       
    client.query("select *, date_format(date, '%Y-%m%-%d %H:%i:%s') as time from board where idx = ?", [req.params.idx], function(err, result, fields){
        if (err){
            console.log("error3");
        }
        else {
            client.query("select *, date_format(date, '%Y-%m%-%d %H:%i:%s') as c_time from comment where board_idx = ?", [req.params.idx], function(err, result2, fields){
                if (err){
                    console.log("error3");
                }
                else {
                    res.render("view", {
                        results: result,
                        results2: result2,
                        session: session
                    })
                }
            })
            //res.render("view", {
            //    results: result
            //});
            let u_hit = result[0].hit + 1;
            console.log('wwww',result)
            client.query("update board set hit = ? where idx = ?", [u_hit, req.params.idx], function(err, result, fields){
                console.log('zzzzzz',result)
                if (err){console.log("errerrrerrrerr")}
            });
            
        }
    });
});
    
app.post('/view/:idx', function(req, res) {
    var view_idx = req.body.view_idx;
    var msg = req.body.msg;
    var user = req.body.dat_user;
    var pw = req.body.dat_pw;
    var content = req.body.dat_content;
    

    if(msg=="up"){
        client.query("update board set likeno = likeno + 1 where idx = ? ", [view_idx], function(err, result, fieldds){
            if (err){
                console.log("err");
            }
            else {
                res.send({result:"success"})
                //var Vprice = result[0].current;
                //var arr = new Array(Vname, Vprice);
                //console.log(result);
                //res.send({result:arr});
            }
        })
    }
    else if(msg=="down"){
        client.query("update board set likeno = likeno - 1 where idx = ? ", [view_idx], function(err, result, fieldds){
            if (err){
                console.log("err");
            }
            else {
                res.send({result:"success"})
                //var Vprice = result[0].current;
                //var arr = new Array(Vname, Vprice);
                //console.log(result);
                //res.send({result:arr});
            }
        })
    }
    else if(user && pw && content){
        //console.log(req.params.idx);
        console.log(user, pw, content);
        client.query("insert into comment(board_idx, name, pw, content, date) values (?, ?, ?, ?, now())", [req.params.idx, user, pw, content], function(err, result, fieldds){
            if (err){
                console.log(err);
            }
            else {
                client.query("update board set cnt_comment = cnt_comment + 1 where idx = ? ", [req.params.idx], function(err, result, fieldds){
                    if (err){
                        console.log(err);
                    }
                    else {
                        res.redirect(req.get('referer'));
                    }
                })
                //res.redirect(req.get('referer'));
                //res.send({result:"success"})
                //var Vprice = result[0].current;
                //var arr = new Array(Vname, Vprice);
                //console.log(result);
                //res.send({result:arr});
            }
        })
       // res.redirect(req.get('referer'));
    }


})



app.get('/writer', function (req, res){
    let session = req.session;

    res.render("writer", {
        session : session
    });
    //res.render("writer")
});

app.post('/writer', function (req, res){
    const b_title = req.body.title;
    const b_name = req.body.name;
    const b_content = req.body.content;
    const b_pw = req.body.pw;

    client.query("insert into board(name, pw, title, content, date) values(?, ?, ?, ?, now())", [b_name, b_pw, b_title, b_content], function(err, result, fields){
        if (err){
            console.log("error4");
        }
        else {
            res.redirect("board")            }
     });
    
});

app.get('/modify/:idx', function (req, res){
    let session = req.session;

    client.query("select * from board where idx = ?", [req.params.idx], function(err, result, fields){
        if (err){
            console.log("error5");
        }
        else {
            res.render("modify", {
                results: result,
                session: session
            });
        }
    });
});

app.post('/modify/:idx', function(req, res){
    const m_name = req.body.name;
    const m_title = req.body.title;
    const m_content = req.body.content;
    const m_pw = req.body.pw;
    console.log(m_name, m_title, m_content, m_pw);
    client.query("update board set title = ?, content = ? where name = ? and pw = ?", [m_title, m_content, m_name, m_pw], function(err, result, fields){
        res.redirect("/../board")
    });
});

app.get('/delete/:idx', function (req, res){
    let session = req.session;

    client.query("select * from board where idx = ?", [req.params.idx], function(err, result, fields){
        if (err){
            console.log("error6");
        }
        else {
            res.render("delete", {
                results: result,
                session: session
            });
        }
    });
});

app.post('/delete/:idx', function(req, res){
    const m_name = req.body.name;
    const m_pw = req.body.pw;
    console.log(m_name, m_pw);

    client.query("delete from board where name = ? and pw = ?", [m_name, m_pw], function(err, result, fields){
        res.redirect("/../board")
    });
});

app.get('/signup', function(req, res, next) {
    let session = req.session;

    res.render("signup", {
        session : session
    });
    //res.render("signup");
})

app.post('/signup', function(req, res, next){
    let name = req.body.userName;
    let email = req.body.userEmail;
    let password = req.body.password;

    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(password + salt).digest("hex");

    client.query("insert into users(name, email, password, salt) values (?, ?, ?, ?)", [name, email, hashPassword, salt], function(err, result, fields){
        if(err){
            console.log("회원가입" + err);
        }
        else {
            res.redirect("/signup");
        }
    });
});

app.get('/login', function(req, res, next) {
    let session = req.session;

    res.render("login", {
        session : session
    });
})

app.post('/login', async function(req, res, next) {
    let body = req.body;

    client.query("select * from users where email = ?", [body.userEmail], function(err, result, fields){
        if(err){
            console.log("회원가입" + err);
        }
        else {
            let dbPassword = result[0].password;
            let inputPassword = body.password;
            let salt = result[0].salt;
            let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
            
            if (dbPassword === hashPassword){
                console.log("비밀번호 일치");
                req.session.email = body.userEmail;
                req.session.save(function() {
                    res.redirect("/");
                })
                //res.redirect("/");
            }
            else {
                console.log("비밀번호 불일치");
                res.redirect("/login");
            }
            //res.redirect("/header");
        }
    });
})

const kakaoKey = {
    clientID: "d9b0bc4bccf95cc138a4c6fe2746b773",
    callbackURL: "http://localhost:3000/login/kakao/oauth"
};

app.get("/login/kakao", passport.authenticate("login-kakao"));

passport.use("login-kakao", new KakaoStrategy(kakaoKey, function(accessToken, refreshToken, profile, done){
        //console.log(profile);
        //console.log(profile.id);
        //console.log(profile._json.kakao_account.email);
        //console.log(profile.username);
        const sql = "select * from social_users where id = ? and provider = ?";
        client.query(sql, [profile.id, profile.provider], function(err, result, fields){
            if(err){
                console.log(err);
            }
            if (result.length === 0) {
                const sql = "insert into social_users(id, provider, name, email) values(?, ?, ?, ?)";
                client.query(sql, [profile.id, profile.provider, profile.username, profile._json.kakao_account.email], function(err, result, fields) {
                    if(err){
                        console.log(err);
                    }
                    const sql = "select * from social_users where id = ? and provider = ?";
                    client.query(sql, [profile.id, profile.provider], function(err, result, fields){
                        if(err){
                            console.log(err);
                        }
                        return done(null, result);
                    })
                })
            }
            else {
                return done(null, result);
                //return done(null, profile);
            }
        })
    })
);

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})

app.get("/login/kakao/oauth", passport.authenticate("login-kakao", {
    successRedirect: '/',
    failureRedirect: '/login'
}))

const naverKey = {
    clientID: "eGdywUn24jKDHDSMZ_jI",
    clientSecret: "yBiDz0foD9",
    callbackURL: "http://localhost:3000/login/naver/oauth"
};

app.get("/login/naver", passport.authenticate("login-naver"));

passport.use("login-naver", new NaverStrategy(naverKey, function(accessToken, refreshToken, profile, done){
    console.log(profile);
    console.log(profile.provider);
    console.log(profile.id);
    console.log(profile.emails[0].value);
    const sql = "select * from social_users where id = ? and provider = ?";
    client.query(sql, [profile.id, profile.provider], function(err, result, fields){
        if(err){
            console.log(err);
        }
        if (result.length === 0) {
            const sql = "insert into social_users(id, provider, name, email) values(?, ?, ?, ?)";
            client.query(sql, [profile.id, profile.provider, profile.displayName, profile.emails[0].value], function(err, result, fields) {
                if(err){
                    console.log(err);
                }
                const sql = "select * from social_users where id = ? and provider = ?";
                client.query(sql, [profile.id, profile.provider], function(err, result, fields){
                    if(err){
                        console.log(err);
                    }
                    return done(null, result);
                })
            })
        }
        else {
            return done(null, result);
            //return done(null, profile);
        }

    })
}))

app.get("/login/naver/oauth", passport.authenticate("login-naver", {
    successRedirect: '/',
    failureRedirect: '/login'
}))

/*
app.get("/login/kakao", passport.authenticate("kakao"));
app.get("/login/kakao/oauth", function(req, res, next) {
    console.log("zzz");
    passport.authenticate("kakao", function(err, user){
        console.log("카카오 실행");
        res.redirect("/");
    })(req, res);
})
*/

app.get("/logout", function(req,res,next){
    req.session.destroy(function(err){});
    res.clearCookie('sid');
    res.redirect("/")
  })



app.listen(3000, function(){
    console.log("실행중");
});

