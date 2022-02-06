var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tally Lights Online' });
});
router.get('/new', function(req, res, next) {
  res.render('settings', { title: 'Settings Page' });
});

module.exports = router;
