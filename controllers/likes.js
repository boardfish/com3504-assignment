var Like = require("../models/likes")
var Story = require("../models/story")
var utils = require("./utils")

/**
 * This controller action creates a new Like object linked to the story with the
 * ID specified by the storyId parameter on the request. A vote from 1 to 5
 * inclusive should also be supplied.
 * @param {Request} req a Request object
 * @param {Response} res a Response object
 */
exports.insert = function (req, res) {
  var like = new Like({
    story: req.params.storyId,
    vote: req.params.vote - 1,
  })
  console.log("received: " + like)
  like.save(function (err, like) {
    if (err) {
      utils.render(req, res, "friendly-error", 200, err, like, {})
      return
    }
    Story.findByIdAndUpdate(like.story, { $push: { likes: like } }, function (
      err,
      _story
    ) {
      utils.render(req, res, "friendly-error", 200, err, like, {})
    })
  })
}
