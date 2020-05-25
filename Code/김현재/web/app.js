const express = require('express'); //express 모듀ퟝ 요청
const ejs = require("ejs"); // ejs 모듈 요청
const app = express();  // app을 express 프레임워크로 킨다
const bodyParser = require('body-parser');
const mysql = require("mysql");


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

app.get('/', function (req, res){
    console.log("hello");
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
                                results3: result3
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
    client.query("select current from stock where name = ? and date_format(day, '%Y-%m-%d') = date_format(now(), '%Y-%m-%d')", [Vname], function(err, result, fieldds){
        if (err){
            console.log("err");
        }
        else {
            var Vprice = result[0].current;
            var arr = new Array(Vname, Vprice);
            console.log(arr);
            res.send({result:arr});
        }
    })
    //console.log("zz"+Vname);
    //res.send({result:Vname})

})

app.get('/board', function (req, res){
    console.log("hello");
    
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
                        results2: result2
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
                        results2: result2
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
                        results2: result2
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
    res.render("writer")
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
    client.query("select * from board where idx = ?", [req.params.idx], function(err, result, fields){
        if (err){
            console.log("error5");
        }
        else {
            res.render("modify", {
                results: result
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
    client.query("select * from board where idx = ?", [req.params.idx], function(err, result, fields){
        if (err){
            console.log("error6");
        }
        else {
            res.render("delete", {
                results: result
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

app.listen(3000, function(){
    console.log("실행중");
});