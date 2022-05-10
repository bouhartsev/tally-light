var createError = require("http-errors");
const projects = require("../models/project.js");

exports.checkName = function (req, res, next) {
    if (projects.check(req.params.name)) next();
    else next(createError(404));
};
