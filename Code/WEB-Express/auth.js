const express = require('express');
const router = express.Router();

/* GET auth page. */

module.exports = function (passport,db) {
  
  router.get('/error', function (request, response) {
    var fmsg = request.flash();
    var feedback = null
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    response.json(feedback);
  });
  

  router.post('/login_process',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true
    }));
  
  router.post('/signup_process',async function (req, res) {
    var post = req.body;
    const conn = await db.getConnection();
    try{
      // email, id 이미 있는 지 확인
      const email = await conn.execute(`SELECT email FROM customer WHERE email=?`,[post.email])
      const id = await conn.execute(`SELECT id FROM customer WHERE id=?`,[post.id])

      var errorFlag = false;
      if(email[0][0] != undefined) {
        req.flash('error','이미 있는 이메일입니다.')
        errorFlag = true;
      }
      else if(id[0][0] != undefined) {
        req.flash('error','이미 있는 아이디입니다.')
        errorFlag = true;
      }
      else{
        await conn.beginTransaction();
        const ins = await conn.execute(`
          INSERT INTO customer VALUES(?, ?, ?, 'A')`,
          [post.id, post.password, post.email])
          await conn.commit()
      }
      

      if(errorFlag){
        res.writeHead(302, {Location: `/auth/signup`});
      } else {
        res.writeHead(302, {Location: `/auth/login`});
      }
      res.end();
    }catch(err){
      conn.rollback();
      return res.status(500).json(err);
    } finally {
      conn.release();
    }
  });
    

  router.post('/logout', function (request, response) {
    request.logout();
    request.session.save(function () {
      response.redirect('/');
    });
  });

  router.get('/', function (request, response) {
    var user = null
    if(request.user){
      user = request.user
    }
    response.json(user)
  });
  
  return router;
};