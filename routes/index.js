var express = require("express");
var router = express.Router();
var navbar = require("../views/data/navbar.json")

var users = require('../controllers/users');
var likes = require('../controllers/likes');
var posts = require('../controllers/story');


var Story = require('../models/story');
/* GET home page. */
router.get("/", posts.getAllStories);

module.exports = router;
