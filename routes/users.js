var express = require("express");
var router = express.Router();
var stories = require("../controllers/story");
var users = require("../controllers/users");
var session = require("../models/session");
var passport = require("passport");
var crypto = require("crypto");

/* GET users listing. */
router.get("/:userId/stories", stories.getAllUserStories);
router.post(
  "/sign_in",
  passport.authenticate("local"),
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  (req, res) => {
    session.create({ user: req.user }, (err, newSession) => {
      res.json({
        id: req.user.id,
        username: req.user.username,
        token: newSession,
      });
    })
  }
);

module.exports = router;
