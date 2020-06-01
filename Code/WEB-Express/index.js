var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (request, response) {
  /*
  var fmsg = request.flash();
  var feedback = '';
  var logline = '<a href="/auth/login">Login</a> | <a href="/auth/signup">signup</a>';
  if(fmsg.success){
    feedback = fmsg.success[0];
  }
  if(request.user){
    logline = `${request.user.nickname} | <a href="/auth/logout">Log out</a>`;
  }
  var output = `
  ${feedback} ${logline}
  `;
  response.send(output);
  */
 var user = 'none';
 if(request.user){
   user = request.user
 }
 response.json(user)
});

module.exports = router;
