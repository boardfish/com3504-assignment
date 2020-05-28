var Story = require("../models/story")
var User = require("../models/users")
var utils = require("./utils")

const consolidateRatings = (ratings) => {
  var consolidatedRatings = Array(5).fill(0)
  ratings.map((like) => like.vote).forEach((x) => (consolidatedRatings[x] += 1))
  return consolidatedRatings
}

exports.insert = function (req, res) {
  var storyData = req.body
  if (storyData == null) {
    res.status(403).send("No Data sent")
  }
  try {
    var story = new Story({
      user: req.user,
      text: storyData.text,
      likes: [],
    })
    console.log("received: " + story)

    story.save(function (err, results) {
      // console.log(results._id);
      if (err) {
        console.log(err)
        res.status(500).send("Invalid data!")
        return
      }
      res.setHeader("Content-Type", "application/json")
      res.send(JSON.stringify(story))
    })
  } catch (e) {
    res.status(500).send("error " + e)
  }
}

exports.getStory = function (req, res) {
  try {
    Story.findById(req.params.storyId)
      .populate("user")
      .populate({ path: "likes", select: "vote -_id" })
      .exec(function (err, story) {
        if (story == null) {
          utils.render(req, res, "components/story", 404, "Not Found", {}, {})
        }
        utils.render(req, res, "components/story", 200, err, story, {
          story: story,
        })
      })
  } catch (e) {
    res.status(500).send("error" + e)
  }
}

const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId)
    return user
  } catch {
    return null
  }
}

exports.getAllStories = async function (req, res) {
  var user = { nickname: "Everyone" }
  if (req.params.userId) {
    user = await findUserById(req.params.userId)
    console.log(`User: ${user}`)
    if (user === null) {
      utils.render(
        req,
        res,
        "friendly-error",
        404,
        "We couldn't find a user with that ID.",
        {},
        {}
      )
      return
    }
  }
  console.log(`User: ${user}`)
  Story.find(req.params.userId ? { user: req.params.userId } : {})
    .populate("user")
    .populate({ path: "likes", select: "vote -_id" })
    .exec(function (err, stories) {
      utils.render(
        req,
        res,
        "index",
        200,
        err,
        stories,
        {
          stories: stories,
          user: req.user || {},
        },
        `${user ? user.nickname : "Everyone"}'s Stories`
      )
      return
    })
}
