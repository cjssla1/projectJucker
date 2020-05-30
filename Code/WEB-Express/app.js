const createError = require('http-errors');
const express = require('express');
const path = require('path'); //critical
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const bodyparser = require('body-parser');

const session = require('express-session');
const mysqlStore = require('express-mysql-session');

const app = express();

// 라우터 가져오기
const indexRouter = require('./routes/index');
const boardRouter = require('./routes/board');
const authRouter = require('./routes/auth');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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
