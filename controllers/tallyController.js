var createError = require("http-errors");
const projects = require("../models/projects.js");

exports.loading = function(req, res, next) {
  projects.checkLoading.then(()=>next()).catch(()=>next(createError(503)));
}

exports.name = function (req, res, next) {
  if (projects.check(req.params.name)) next();
  else next(createError(404));
};
exports.settings = function(req, res, next) {
  res.render('settings', { pageTitle: 'Settings Page', liveChecked: projects.checkLive(req.params.name) });
}
exports.director = function(req, res, next) {
  if (projects.checkLive(req.params.name)) res.render('director', { pageTitle: 'Director Page' });
  else next(createError(404));
}
exports.camera = function (req, res, next) {
  let id = Number(req.params.id);
  if (!isNaN(id) && Number.isInteger(id) && id >= 0 && projects.checkLive(req.params.name))
    res.render("camera", { pageTitle: "Camera " + id, cam_id: id });
  else next(createError(404));
};
