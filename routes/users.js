var express = require("express");
var router = express.Router();
var stories = require("../controllers/story");
var users = require("../controllers/users");
var passport = require("passport");

/* GET users listing. */
router.get("/:userId/stories", stories.getAllUserStories);
router.post(
  "/sign_in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/youfuckedup"
  })
);

module.exports = router;
