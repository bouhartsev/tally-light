var express = require("express");
var router = express.Router();

var tallyRouter = require("./tally");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Tally Lights Online" });
});
router.route("/new")
  .get(function (req, res, next) {
    res.render("new", { title: "Create new project" });
  })
  .post(function(req, res, next){
    try {
      // all checks and create
      projects.create(value, clients[id]["quantity"]);
      // return success
      
    } catch (error) {
      // return error
      // redirect to settings
    }
    console.log('testing');
  });
router.use("/:name", tallyRouter);

module.exports = router;
