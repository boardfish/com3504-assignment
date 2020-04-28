var express = require("express");
var router = express.Router();

var likes = require('../controllers/likes');
var stories = require('../controllers/story');

/* GET home page. */
router.get("/", stories.getAllStories);
router.post("/:storyId/rate/:vote", likes.insert);

module.exports = router;