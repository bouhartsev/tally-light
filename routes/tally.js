var express = require('express');
var router = express.Router({mergeParams: true});

var control = require('../controllers/tallyController');
router.use(control.loading);
router.use(control.name);

// Change / to settings
router.get(['/', '/settings'], control.settings);
router.get('/director', control.director);
router.get('/camera/:id', control.camera);


module.exports = router;