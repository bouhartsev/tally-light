var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('director', { title: 'Director Page' });
});
router.all('/:id', function(req, res, next) {
  let id = req.params.id;
  res.render('camera', { title: 'Camera '+id });
});


module.exports = router;
