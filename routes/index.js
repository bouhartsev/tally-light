var express = require("express");
var router = express.Router();

var tallyRouter = require("./tally");
const projects = require("../models/projects.js");

router.get("/", function (req, res, next) {
  res.render("index", { pageTitle: "Tally Lights Online" });
});
router.route("/new")
  .get(function (req, res, next) {
    res.render("new", { pageTitle: "Create new project", setSubmit: true });
  })
  .post(function(req, res, next){
    let data = req.body;
    let result = projects.create(data["title"], data["quantity"]); // other data when implemented
    if (result!="Complete") 
      res.render("new", { pageTitle: "Create new project", setSubmit: true, data: data, wrong: result });
    else {
      res.redirect("/"+data["title"]+"/settings");
    }
  });
router.use("/:name", tallyRouter);

projects.setStatic(router.stack.flatMap(middleware => {if (middleware.route) return middleware.route.path.slice(1); else return []}));

module.exports = router;
