var express = require('express');
var router = express.Router();

// Change to main ws
router.get('/', function(req, res, next) {
  res.render('director', { title: 'Director Page' });
});
router.get('/settings', function(req, res, next) {
  res.render('settings', { title: 'Settings Page' });
});
router.get('/director', function(req, res, next) {
  res.render('director', { title: 'Director Page' });
});
router.all('/:id', function(req, res, next) {
  let id = req.params.id;
  res.render('camera', { title: 'Camera '+id, cam_id: id });
});


module.exports = router;
