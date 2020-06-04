const createError = require('http-errors');
const express = require('express');
const path = require('path'); //critical
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const bodyparser = require('body-parser');
//auth 
const session = require('express-session');
const mysqlStore = require('express-mysql-session');
var flash = require('connect-flash');
//DB
const mysql = require('mysql2/promise');
const db = mysql.createPool({
    host      : 'localhost',
    user      : 'admin',
    password  : '1234',
    database  : 'WEB',
    waitForConnections: true,
    connectionLimit: 10,
});
/*
const db = mysql.createPool({
  host      : 'jukerdb.cwhsnjoqybdo.ap-northeast-2.rds.amazonaws.com',
  user      : 'admin',
  password  : ,
  database  : ,
  port      : ,
  waitForConnections: true,
  connectionLimit: 10,
});
*/
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//미들 웨어
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({extended:false}));
app.use(compression())//데이터 압축
app.use(session({//세션 저장
  secret:'secrets',
  resave:false,
  saveUninitialized:true,
  store:new mysqlStore({
    host:'localhost',
    port:3306,
    user:'admin',
    password:'1234',
    database:'WEB'
  })
}))
app.use(flash());
var passport = require('./lib/passport')(app,db);


// 라우터 가져오기
const indexRouter = require('./routes/index');
const boardRouter = require('./routes/board')(db);
var authRouter = require('./routes/auth')(passport,db);

// 라우터 사용
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/board', boardRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
