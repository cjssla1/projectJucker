const express = require('express');
const router = express.Router();

/* GET home page. */

router.post('/login_process', function(req, res, next) {

  var userinfo = {
    user_id : "hi",
    user_pwd: "1234"
  }

  var uid = req.body.id;
  var upwd = req.body.pwd;

  if(uid === userinfo.user_id && upwd === userinfo.user_pwd){
    req.session.is_logined = true;
    req.session.nickname = userinfo.user_id;
    req.session.save(function(){
      res.redirect('/auth');
    });
  }
  else{
    res.redirect('/auth/login');
  }
});

router.get('/login', function(req, res, next) {
  var output = `
    <h1>Login</h1>
    <form action="/auth/login_process" method="POST">
      <p>
        <input type="text" name="id" placeholder="ID">
      </p>
      <p>
        <input type="password" name="pwd" placeholder="Password">
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
  `
  res.send(output);
});


router.get('/logout',function(req, res, next){
  req.session.destroy(function(err){
    res.redirect('/auth');
  });
});

router.get('/', function(req, res, next) {
  var output ="";
  if(req.session.nickname){
    output +=`
      <h1>hello, ${req.session.nickname}</h1>
      <a href="/auth/logout">logout</a>
      `;
      res.send(output);
  }else{
    output+=`
      <h1>Hello ???</h1>
      <a href="/auth/login">login</a>
    `
    res.send(output);
  }
  
});

module.exports = router;
