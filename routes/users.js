var express = require('express');
var router = express.Router();
var stories = require('../controllers/story');

/* GET users listing. */
router.get('/:userId/stories', stories.getAllUserStories)

module.exports = router;
