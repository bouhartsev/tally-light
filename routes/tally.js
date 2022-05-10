var express = require('express');
var router = express.Router({mergeParams: true});

var checkName = require('../controllers/nameController').checkName;
router.use(checkName);

// Change / to main ws
router.get(['/', '/director'], function(req, res, next) {
  res.render('director', { title: 'Director Page' });
});
router.get('/settings', function(req, res, next) {
  res.render('settings', { title: 'Settings Page' });
});
router.get('/:id', function(req, res, next) {
  let id = req.params.id;
  // >0, целое число
  if (!isNaN(id)) res.render('camera', { title: 'Camera '+id, cam_id: id });
  else next();
});


module.exports = router;