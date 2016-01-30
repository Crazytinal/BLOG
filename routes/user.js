var express = require('express');
var user = express.Router();
/*------user operation------*/
user.post('/regist', function(req, res) {
  console.log(req.cookies);
  console.log(req.session);
  var user_info = req.body;
  var user = {};
  user[user_info.username] = user_info;
  data.users.push(user);
  console.log(user);
  res.json(true);
});

module.exports = user;