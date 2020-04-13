var express = require("express");
var router = express.Router();
var navbar = require("../views/data/navbar.json")

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express", path: req.path, navbar: navbar })
});

module.exports = router;
