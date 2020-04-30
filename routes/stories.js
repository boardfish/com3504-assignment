var express = require("express");
var router = express.Router();

var likes = require('../controllers/likes');
var stories = require('../controllers/story');

/* GET home page. */
router.get("/", stories.getAllStories);
router.get("/:storyId", stories.getStory);
router.post("/:storyId/rate/:vote", likes.insert);
router.post("/stories", function(req, res){
  console.log("THIS FUNCTION IS ALSO WORKING!!!!!!!")
})

module.exports = router;