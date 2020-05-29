var Like = require("../models/likes")
var Story = require("../models/story")
var utils = require("./utils")

/**
 * This controller action creates a new Like object linked to the story with the
 * ID specified by the storyId parameter on the request. A vote from 1 to 5
 * inclusive should also be supplied.
 * @param {Request} req a Request object
 * @param {Response} res a Response object
 * @memberof Like
 */
exports.insert = function (req, res) {
  var data = {
    story: req.params.storyId,
    vote: req.params.vote - 1,
    user: req.user._id
  }
  console.log("received: " + data)
  Like.findOneAndUpdate({ user: req.user._id, story: req.params.storyId }, data, {
    new: true, upsert: true
  }, function (err, like) {
    if (err) {
      utils.render(req, res, "friendly-error", 200, err, like, {})
      return
    }
    console.log("Like: ", like)
    Story.findByIdAndUpdate(like.story, { $addToSet: { likes: like } }, { new:true }, function (
      err,
      _story
    ) {
      if (err) {
        console.log(err)
      }
      console.log(_story)
      utils.render(req, res, "friendly-error", 200, err, data, {})
    })
  })
}
