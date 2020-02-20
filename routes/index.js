var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/trainee');
  //res.render('index', { title: 'Hello Node Express' });
});

module.exports = router;
