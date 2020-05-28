// Please see the OpenAPI documentation for documentation on routes.

var express = require("express")
var router = express.Router()
var navbar = require("../views/data/navbar.json")

var users = require("../controllers/users")
var likes = require("../controllers/likes")
var stories = require("../controllers/story")

var Story = require("../models/story")
/* GET home page. */
router.get("/", stories.getAllStories)
router.post("/stories", stories.insert)
router.post("/users", users.insert)
router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})

module.exports = router
