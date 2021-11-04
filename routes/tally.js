var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('director', { title: 'Director Page' });
});
router.all('/*', function(req, res, next) {
  res.render('camera', { title: 'Camera Page' });
});


module.exports = router;
