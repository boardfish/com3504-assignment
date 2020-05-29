var Story = require("../models/story")
var User = require("../models/users")
var utils = require("./utils")
var io = require("socket.io").listen(4000)

/**
 * This controller action creates a new story against the currently
 * authenticated user.
 * @param {Request} req a Request object
 * @param {Response} res a Response object
 * @memberof Story
 */
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
      io.sockets.emit("newStory", story)
    })
  } catch (e) {
    res.status(500).send("error " + e)
  }
}

/**
 * This controller action retrieves just one story by its ID, including the
 * accompanying user and rating data. If HTML is requested, note that a full
 * view is not returned - only the HTML data for the story div is returned, such
 * that it should be appended to the page using jQuery.
 * @param {Request} req a Request object
 * @param {Response} res a Response object
 * @memberof Story
 */
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

/**
 * Finds a user by their ID. In the event of an error (particularly defending
 * against CastError here), null is returned. This is a wrapper for
 * User.findById that handles invalid IDs (albeit heavy-handedly).
 * @param {string} userId the ID of a user in the database
 * @returns {Object} a user, or null if no user exists with that ID
 * @memberof Story
 */
const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId)
    return user
  } catch {
    return null
  }
}

/**
 * This controller action retrieves either all stories on the site or, if the
 * parameter userId is specified on the request, one user's stories (i.e. their
 * wall). If the user could not be found, a 404 error response is returned.
 * @param {Request} req a Request object
 * @param {Response} res a Response object
 * @memberof Story
 */
exports.getAllStories = async function (req, res) {
  var user = { nickname: "Everyone" }
  var idForLookup = req.params.userId
  if (req.params.userId) {
    idForLookup = req.params.userId === "me" ? req.user._id : req.params.userId
    console.log(`Id for lookup: ${idForLookup}`)
    user = await findUserById(idForLookup)
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
  Story.find(idForLookup ? { user: idForLookup } : {})
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
        `${user.nickname}'s Stories`
      )
      return
    })
}
