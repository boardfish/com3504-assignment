var Like = require("../models/likes");
var Story = require("../models/story")
var utils = require("./utils");

exports.insert = function (req, res) {
  var like = new Like({
    story: req.params.storyId,
    vote: (req.params.vote - 1),
  });
  console.log("received: " + like);
  like.save(function (err, like) {
    if (err) {
      utils.render(req, res, "friendly-error", 200, err, like, {});
      return;
    }
    Story.findByIdAndUpdate(
        like.story, 
        { $push: { likes: like } },
        function(err, _story) {
          utils.render(req, res, "friendly-error", 200, err, like, {});
        }
    );
  });
};
