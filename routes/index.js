var express = require('express');

/*
 * GET home page.
 */
var router = express.Router();

router.get('/', function(req, res){
  res.render('index');
});



router.get('/partials/:name', function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
});

router.get('*', function(req, res) {
	res.redirect('/');
});
  
module.exports = router;