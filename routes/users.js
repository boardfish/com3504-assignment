var express = require("express")
var router = express.Router()
var stories = require("../controllers/story")
var users = require("../controllers/users")

/* GET users listing. */
router.get("/:userId/stories", stories.getAllUserStories)
router.post("/sign_in", users.signIn)

module.exports = router
