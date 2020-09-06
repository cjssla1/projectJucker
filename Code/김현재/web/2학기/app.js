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

/*
    client.query(";", function(err, result, fields){
        if (err)
        {
            console.log("web_stcok : 현재 날짜 상위 12종목 데이터 추출 오류");
        }
        else
        {
            res.render("JCmain", {
                results: result, // 상위 12종목 데이터 추출
                session: session // 세션
            });
        }
    });
*/

app.get('/', function(req, res){
    let session = req.session;
    client.query("select * from web_stock where date_format(day, '%Y-%m-%d') = curdate() order by aggregate DESC limit 12;", function(err, result, fields){
        if (err)
        {
            console.log("web_stcok : 현재 날짜 상위 12종목 데이터 추출 오류");
        }
        else
        {
            client.query("SELECT pageid, title, cnt_reply FROM board WHERE up >= 3 ORDER BY pageid DESC LIMIT 13;", function(err, result2, fields){
                if (err)
                {
                    console.log("board : 추천 게시글 추출 오류");
                }
                else
                {
                    client.query("SELECT pageid, title, cnt_reply FROM board ORDER BY pageid DESC LIMIT 13;", function(err, result3, fields){
                        if (err)
                        {
                            console.log("board : 자유 게시글 추출 오류");
                        }
                        else
                        {
                            res.render("JCmain", {
                                results: result, // 상위 12종목 데이터 추출
                                results2: result2, // 추천 게시글 추출
                                results3: result3, // 자유 게시글 추출
                                session: session // 세션
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post('/', function(req, res) {
    var name = req.body.stock_name;
    //console.log(name);
    client.query("SELECT symbol FROM stock WHERE name = ?;", [name], function(err, result, fields){
        if (err)
        {
            console.log("stcok : name에 해당하는 symbol 데이터 추출 오류");
        }
        else
        {
            client.query("SELECT current, value FROM web_stock, stockpredict WHERE date_format(day, '%Y-%m-%d') = curdate() AND name = ? AND symbol = ?;", [name, result[0].symbol], function(err, result2, fields){
                if (err)
                {
                    console.log("web_stock : 메인페이지 예측 데이터 추출 오류");
                }
                else
                {
                    var current_price = result2[0].current;
                    var predicted_price = result2[0].value;
                    var data = new Array(current_price, predicted_price); 
                    //console.log(data);
                    res.send({arr:data});
                }
            });
        }
    });
});

app.get('/board', function (req, res){
    let session = req.session;
    client.query("select *, date_format(time, '%H:%i') as time from board order by pageid desc limit 20;", function(err, result, fields){
        if (err)
        {
            console.log("board : 게시글 목록 추출 오류");
        }
        else 
        {
            res.render("JCboard", {
                results: result,
                session: session
            });
        }
    });
})

/* -------------------------------------------------------
app.get('/', function (req, res){
    let session = req.session;
    //console.log(req.user[0].email);
    //console.log(req.user[0]);
    //console.log(session);
    //console.log(session.passport.user[0].email);
    console.log(session.customerid);
    client.query("select name, current, aggregate, tran, updown from web_stock where date_format(day, '%Y-%m-%d') = date_format(now(), '%Y-%m-%d') order by aggregate DESC limit 10;", function(err, result, fields){
        if (err){
            console.log(err + "error1");
        }
        else {
            client.query("select name, updown from web_stock where updown >= 5 and date_format(day, '%Y-%m-%d') = date_format(now(), '%Y-%m-%d') order by updown DESC limit 10;", function(err, result2, fields){
                if (err){
                    console.log("중첩에러");
                }
                else{
                    //client.query("select A.pageid, A.title, count(*) as cnt from board as A, reply as B where A.pageid = B.pageid and A.up >= 3 group by B.pageid order by pageid DESC limit 10;", function(err, result3, fields) {
                    client.query("select pageid, title, cnt_reply from board where up >= 3 order by pageid DESC limit 10;", function(err, result3, fields) {
                        if(err){
                            console.log(err);
                        }
                        else {

                                res.render("JCmain", {
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
    client.query("select * from stockpredict where symbol = (select symbol from stock where name = ?);", [Vname], function(err, result, fieldds){
    //client.query("select current, (abs(current - low)/low) * 100 as rate from web_stock where name = ? and date_format(day, '%Y-%m-%d') = date_format(now(), '%Y-%m-%d')", [Vname], function(err, result, fieldds){
        if (err){
            console.log("err");
        }
        else {
            client.query("select current from web_stock where name = ? and date_format(day, '%Y-%m-%d') = date_format(now(), '%Y-%m-%d')", [Vname], function(err, result2, fieldds){
                if (err){
                    console.log("에러입니다!!" + err);
                }
                else {
                    try {
                        var Vprice = result[0].value;
                        var Vcurrent = result2[0].current;
                        var Vrate = (Math.abs(Vcurrent - Vprice)/Vprice) * 100;
                        var arr = new Array(Vname, Vprice, Vrate);
                        console.log(arr);
                        res.send({result:arr});
                    } catch (e) {
                        //var arr = "값이 존재하지 않습니다.";
                        console.log(arr);
                        res.send({arr:"값이 존재하지 않습니다."});
                    }
                }
                

            })

        }
    })
    //console.log("zz"+Vname);
    //res.send({result:Vname})

})


app.get('/board', function (req, res){
    console.log("hello");
    let session = req.session;
    
    client.query("select *, date_format(time, '%H:%i') as time from board order by pageid desc limit 0,10;", function(err, result, fields){
        if (err){
            console.log("error2-1");
        }
        else {
            res.render("board", {
                results: result,
                session: session
            });
            //res.render("board", {
            //    results: result
            //});
        }
    });
})

------------------------------------------------------ */

app.get('/recommend-board', function (req, res){
    console.log("hello");
    let session = req.session;
    
    client.query("select *, date_format(time, '%H:%i') as time from board where up >= 3 order by pageid desc limit 0,10;", function(err, result, fields){
        if (err){
            console.log(err);
        }
        else {

                    res.render("recommend-board", {
                        results: result,
                        session: session
                    });

            //res.render("board", {
            //    results: result
            //});
        }
    });
})

app.get('/view/:pageid', function(req, res){
    //console.log(req.params.pageid);
    let session = req.session;
       
    client.query("select *, date_format(time, '%Y-%m%-%d %H:%i:%s') as time from board where pageid = ?", [req.params.pageid], function(err, result, fields){
        if (err){
            console.log("error3");
        }
        else {
            client.query("select *, date_format(time, '%Y-%m%-%d %H:%i:%s') as c_time from reply where pageid = ?", [req.params.pageid], function(err, result2, fields){
                if (err){
                    console.log("error3");
                }
                else {
                    client.query("select *, date_format(time, '%Y-%m%-%d %H:%i:%s') as c_time from rereply where pageid = ?", [req.params.pageid], function(err, result3, fields){
                        if(err){
                            console.log("대댓글");
                        }
                        else{
                            console.log(result3);
                            res.render("view", {
                                results: result,
                                results2: result2,
                                results3: result3,
                                session: session
                            })
                            
                        }
                    })

                }
            })
            //res.render("view", {
            //    results: result
            //});
            let u_hit = result[0].view + 1;
            //console.log('wwww',result)
            client.query("update board set view = ? where pageid = ?", [u_hit, req.params.pageid], function(err, result, fields){
                //console.log('zzzzzz',result)
                if (err){console.log("errerrrerrrerr")}
            });
            
        }
    });
});
    
app.post('/view/:pageid', function(req, res) {
    var view_idx = req.body.view_idx;
    var msg = req.body.msg;
    var user = req.body.dat_user;
    var pw = req.body.dat_pw;
    var confirm = req.body.confirm;
    var content = req.body.dat_content;

    if(msg=="up"){
        client.query("update board set up = up + 1 where pageid = ? ", [view_idx], function(err, result, fieldds){
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
        client.query("update board set down = down - 1 where pageid = ? ", [view_idx], function(err, result, fieldds){
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
    else if(user && pw && content && msg === "re"){
        //console.log(req.params.idx);
        console.log(user, pw, content);
        client.query("select reid from reply where pageid = ?", [req.params.pageid], function(err, result2, fields){
            if(result2.length != 0){
                console.log("@@@@@@@@@@@@" + result2[result2.length-1].reid)
                client.query("insert into reply(pageid, id, pwd, content, reid, time) values (?, ?, ?, ?, ?, now())", [req.params.pageid, user, pw, content, result2[result2.length-1].reid + 1], function(err, result, fields){
                    if (err){
                        console.log("여긴가요1" + err);
                    }
                    else {
                        //res.redirect(req.get('referer'));
                        client.query("update board set cnt_reply = cnt_reply + 1 where pageid = ? ", [req.params.pageid], function(err, result, fieldds){
                            if (err){
                                console.log(err);
                            }
                            else {
                                res.redirect(req.get('referer'));
                            }
                        })
                    }
                })

            }
            else{
                client.query("insert into reply(pageid, id, pwd, content, reid, time) values (?, ?, ?, ?, ?, now())", [req.params.pageid, user, pw, content, 1], function(err, result, fields){
                    if (err){
                        console.log("여긴가요2" + err);
                    }
                    else {
                        //res.redirect(req.get('referer'));
                        client.query("update board set cnt_reply = cnt_reply + 1 where pageid = ? ", [req.params.pageid], function(err, result, fieldds){
                            if (err){
                                console.log(err);
                            }
                            else {
                                res.redirect(req.get('referer'));
                            }
                        })
                    }
                })
            }
        })
       // res.redirect(req.get('referer'));
    }
    else if(user && pw && content && msg === "rere"){
        console.log(user, pw, content, msg, confirm);
        
        client.query("select rereid from rereply where pageid = ? and reid = ?", [req.params.pageid, confirm], function(err, result2, fields){
            if(result2.length != 0){
                client.query("insert into rereply(pageid, id, pwd, content, reid, rereid, time) values (?, ?, ?, ?, ?, ?, now())", [req.params.pageid, user, pw, content, confirm, result2[result2.length-1].rereid + 1], function(err, result, fields){
                    if (err){
                        console.log("여긴가요1" + err);
                    }
                    else {
                        //res.redirect(req.get('referer'));
                        client.query("update board set cnt_reply = cnt_reply + 1 where pageid = ? ", [req.params.pageid], function(err, result, fieldds){
                            if (err){
                                console.log(err);
                            }
                            else {
                                res.redirect(req.get('referer'));
                            }
                        })
                    }
                })
            }
            else{
                client.query("insert into rereply(pageid, id, pwd, content, reid, rereid, time) values (?, ?, ?, ?, ?, ?, now())", [req.params.pageid, user, pw, content, confirm, 1], function(err, result, fields){
                    if (err){
                        console.log("여긴가요2" + err);
                    }
                    else {
                        //res.redirect(req.get('referer'));
                        client.query("update board set cnt_reply = cnt_reply + 1 where pageid = ? ", [req.params.pageid], function(err, result, fieldds){
                            if (err){
                                console.log(err);
                            }
                            else {
                                res.redirect(req.get('referer'));
                            }
                        })
                    }
                })
            }
        })
        
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

    client.query("insert into board(id, pwd, title, content, time) values(?, ?, ?, ?, now())", [b_name, b_pw, b_title, b_content], function(err, result, fields){
        if (err){
            console.log("error4");
        }
        else {
            res.redirect("board")            }
     });
    
});

app.get('/modify/:pageid', function (req, res){
    let session = req.session;

    client.query("select * from board where pageid = ?", [req.params.pageid], function(err, result, fields){
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

app.post('/modify/:pageid', function(req, res){
    const m_name = req.body.name;
    const m_title = req.body.title;
    const m_content = req.body.content;
    const m_pw = req.body.pw;
    
    console.log(m_name, m_title, m_content, m_pw, req.params.pageid);
    client.query("update board set title = ?, content = ? where id = ? and pwd = ? and pageid = ?", [m_title, m_content, m_name, m_pw, req.params.pageid], function(err, result, fields){
        res.redirect("/../view/" + req.params.pageid)
    });
});

app.get('/delete/:pageid', function (req, res){
    let session = req.session;

    client.query("select * from board where pageid = ?", [req.params.pageid], function(err, result, fields){
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

app.post('/delete/:pageid', function(req, res){
    const m_name = req.body.name;
    const m_pw = req.body.pw;
    console.log(m_name, m_pw);

    client.query("delete from board where id = ? and pwd = ?", [m_name, m_pw], function(err, result, fields){
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
    let id = req.body.userId;
    let email = req.body.userEmail;
    let password = req.body.password;

    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(password + salt).digest("hex");

    client.query("insert into customer(id, email, pwd, salt) values (?, ?, ?, ?)", [id, email, hashPassword, salt], function(err, result, fields){
        if(err){
            console.log("회원가입" + err);
        }
        else {
            res.redirect("/login");
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

    client.query("select * from customer where id = ?", [body.userId], function(err, result, fields){
        if(err){
            console.log("회원가입" + err);
        }
        else {
            let dbPassword = result[0].pwd;
            let inputPassword = body.password;
            let salt = result[0].salt;
            let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
            
            if (dbPassword === hashPassword){
                console.log("비밀번호 일치");
                req.session.customerid = result[0].id;
                //req.session.email = body.userEmail;
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
        const sql = "select * from customer where id = ? and provider = ?";
        client.query(sql, [profile.id, profile.provider], function(err, result, fields){
            if(err){
                console.log(err);
            }
            if (result.length === 0) {
                const sql = "insert into customer(id, provider, name, email) values(?, ?, ?, ?)";
                client.query(sql, [profile.id, profile.provider, profile.username, profile._json.kakao_account.email], function(err, result, fields) {
                    if(err){
                        console.log(err);
                    }
                    const sql = "select * from customer where id = ? and provider = ?";
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
    const sql = "select * from customer where id = ? and provider = ?";
    client.query(sql, [profile.id, profile.provider], function(err, result, fields){
        if(err){
            console.log(err);
        }
        if (result.length === 0) {
            const sql = "insert into customer(id, provider, name, email) values(?, ?, ?, ?)";
            client.query(sql, [profile.id, profile.provider, profile.displayName, profile.emails[0].value], function(err, result, fields) {
                if(err){
                    console.log(err);
                }
                const sql = "select * from customer where id = ? and provider = ?";
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

app.get('/information', function(req, res, next){
    res.redirect('/information/1');
})

app.get('/information/:page', function(req, res, next) {
    let session = req.session;
    var page = req.params.page;


    const sql = "select * from web_stock where date_format(day, '%Y-%m-%d') = date_format(now(), '%Y-%m-%d') order by aggregate DESC;"
    client.query(sql, function(err, result, fields){
        res.render("information", {
            results: result,
            page: page,
            length: result.length-1,
            page_num:20,
            pass:true,
            session : session
        });
        console.log(result.length-1)
    })

})

app.post('/information', function(req, res) {
    var Vname = req.body.stock_name;
    //console.log('POST Para = ' + Vname);
    client.query("select symbol from stock where name = ?", [Vname], function(err, result, fieldds){
        if (err){
            console.log(err);
        }
        else if (result.length == 0){
            console.log("데이터 없음");
        }
        else {
            var symbol = result[0].symbol;
            console.log(symbol);
            res.send({result:symbol});
        }
    })
    //console.log("zz"+Vname);
    //res.send({result:Vname})

})

app.listen(3000, function(){
    console.log("실행중");
});


