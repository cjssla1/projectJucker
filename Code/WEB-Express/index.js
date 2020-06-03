var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (request, response) {
  
 var user = 'none';
 if(request.user){
   user = request.user
 }
 response.json(user)
});

module.exports = router;
