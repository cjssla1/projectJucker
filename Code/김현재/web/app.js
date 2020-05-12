const express = require('express'); //express 모듀ퟝ 요청
const ejs = require("ejs"); // ejs 모듈 요청
const app = express();  // app을 express 프레임워크로 킨다
const bodyParser = require('body-parser');
const mysql = require("mysql");


const client = mysql.createConnection({
    host: "localhost",
    user: "admin",
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
    client.query("select name, current, aggregate, tran from stock where date_format(day, '%Y-%m-%d') = date_format(now(), '%Y-%m-%d') order by aggregate DESC limit 10;", function(err, result, fields){
        if (err){
            console.log("error");
        }
        else {
            res.render("main", {
                results: result
            });
        }
    });
})

app.get('/board', function (req, res){
    console.log("hello");
    
    client.query("select * from board order by idx desc limit 0,10;", function(err, result, fields){
        if (err){
            console.log("error");
        }
        else {
            res.render("board", {
                results: result
            });
        }
    });
})

app.get('/view/:idx', function(req, res){
    console.log(req.params.idx);
       
    client.query("select * from board where idx = ?", [req.params.idx], function(err, result, fields){
        if (err){
            console.log("error");
        }
        else {
            res.render("view", {
                results: result
            });
            let u_hit = result[0].hit + 1;
            console.log('wwww',result)
            client.query("update board set hit = ? where idx = ?", [u_hit, req.params.idx], function(err, result, fields){
                console.log('zzzzzz',result)
                if (err){console.log("errerrrerrrerr")}
            });
            
        }
    });
});
    
    


app.get('/writer', function (req, res){
    res.render("writer")
});

app.post('/writer', function (req, res){
    const b_title = req.body.title;
    const b_name = req.body.name;
    const b_content = req.body.content;
    const b_pw = req.body.pw;

    client.query("insert into board(name, pw, title, content, date) values(?, ?, ?, ?, date_format(now(), '%Y-%m-%d'))", [b_name, b_pw, b_title, b_content], function(err, result, fields){
        if (err){
            console.log("error");
        }
        else {
            res.redirect("board")            }
     });
    
});

app.get('/modify/:idx', function (req, res){
    client.query("select * from board where idx = ?", [req.params.idx], function(err, result, fields){
        if (err){
            console.log("error");
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
            console.log("error");
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