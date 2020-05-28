/**
 * Please see the OpenAPI documentation for documentation on routes.
 */

var express = require("express")
var router = express.Router()
var stories = require("../controllers/story")
var passport = require("passport")

/* GET users listing. */
router.get("/:userId/stories", stories.getAllStories)
router.get("/me", (req, res) => res.send(JSON.stringify(req.user)))
router.post(
  "/sign_in",
  passport.authenticate("local", { successRedirect: "/users/me" })
)

module.exports = router
