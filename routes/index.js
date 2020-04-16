var express = require("express");
var router = express.Router();
var navbar = require("../views/data/navbar.json")

var users = require('../controllers/users');
var likes = require('../controllers/likes');
var posts = require('../controllers/story');


/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express", path: req.path, navbar: navbar })
});

module.exports = router;
