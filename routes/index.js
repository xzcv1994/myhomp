var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main.jade');
    console.log('main page render');
});

module.exports = router;
