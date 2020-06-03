const express = require('express');
const router = express.Router();

/* GET home page. */

module.exports = function (passport) {
  
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