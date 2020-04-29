var Story = require("../models/story");
var User = require("../models/users");
var utils = require("./utils");

const consolidateRatings = (ratings) => {
  var consolidatedRatings = Array(5).fill(0);
  ratings
    .map((like) => like.vote)
    .forEach((x) => (consolidatedRatings[x] += 1));
  return consolidatedRatings;
};

exports.insert = function (req, res) {
  var storyData = req.body;
  if (storyData == null) {
    res.status(403).send("No Data sent");
  }
  try {
    var story = new Story({
      user: storyData.user,
      text: storyData.text,
      likes: [],
    });
    console.log("received: " + story);

    story.save(function (err, results) {
      // console.log(results._id);
      if (err) {
        console.log(err);
        res.status(500).send("Invalid data!");
        return;
      }
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(story));
    });
  } catch (e) {
    res.status(500).send("error " + e);
  }
};

exports.getStory = function (req, res) {
  try {
    Story.findById(req.params.storyId)
      .populate("user")
      .populate({ path: "likes", select: "vote -_id" })
      .exec(function (err, story) {
        utils.render(req, res, "components/story", 200, err, story, {
          story: story,
          user: story.user,
        });
      });
  } catch (e) {
    res.status(500).send("error" + e);
  }
};

exports.getAllUserStories = function (req, res) {
  try {
    User.findById(req.params.userId, (err, user) => {
      // If an invalid ID is passed...
      if ((err || {}).name === "CastError") {
        utils.render(
          req,
          res,
          "friendly-error",
          404,
          "We couldn't find a user with that ID.",
          {},
          {}
        );
        // ...or a user with the valid ID doesn't exist
      } else if (user === null) {
        utils.render(
          req,
          res,
          "friendly-error",
          404,
          "We couldn't find a user with that ID.",
          {},
          {}
        );
      }
      Story.find({ user: req.params.userId }, "text")
        .populate("user")
        .populate({ path: "likes", select: "vote -_id" })
        .exec(function (err, stories) {
          utils.render(req, res, "index", 200, err, stories, {});
        });
    });
  } catch (e) {
    res.status(500).send("error " + e);
    return;
  }
};

exports.getAllStories = function (req, res) {
  try {
    Story.find({})
      .populate("user")
      .populate({ path: "likes", select: "vote -_id" })
      .exec(function (err, stories) {
        utils.render(req, res, "index", 200, err, stories, {
          stories: stories,
        });
      });
  } catch (e) {
    res.status(500).send("error " + e);
    return;
  }
};
