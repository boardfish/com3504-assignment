var Story = require('../models/story');
var navbar = require("../views/data/navbar.json")

exports.insert = function (req, res) {
  var postData = req.body;
  if (postData == null) {
    res.status(403).send('No Data sent');
  }
  try {
    var post = new Story({
      user_id: postData.id,
      text: postData.text,
      likes: postData.likes
    });
    console.log('received: ' + post);

    post.save(function (err, results) {
      console.log(results._id);
      if (err)
        res.status(500).send('Invalid data!');

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(post));
    });

  } catch (e) {
    res.status(500).send('error ' + e);
  }

};

exports.getStory = function (req, res) {
  var userData = req.body;
  if (userData == null) {
    res.status(403).send('No data sent!')
  }
  try {
    Story.find({storyId: userData.story_id}, 'userId text likes',
      function (err, stories) {
        if (err)
          res.status(500).send('Invalid data!');
        var story = null;
        if (stories.length > 0) {
          var storyData = story[0];
          story = {
            userID: storyData.user_id, text: storyData.text,
            likes: storyData.likes
          };
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(story));

      })
  } catch (e) {
    res.status(500).send('error' + e);
  }
};

exports.getAllUserStories = function (req, res) {
  var data = req.body;
  if (data == null) {
    res.status(403).send('No data sent')
    return;
  }
  try {
    Story.find({userId: data.user_id}, 'text likes',
      function (err, stories) {
        if (err) {
          res.status(500).send('Invalid data!');
          return;
        }
        stories = [stories]
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(stories))
      });
  } catch (e) {
    res.status(500).send('error ' + e);
  }
};


exports.getAllStories = function (req, res) {
  try {
    Story.find({}, 'text likes',
      function (err, stories) {
        if (err) {
          res.status(500).render("error", { error: {status: 500, stack: ''}, message: JSON.stringify(err) })
          return;
        }
        res.render("index", { title: "Express", path: req.path, navbar: navbar, stories: stories, err: err })
      });
  } catch (e) {
    res.status(500).send('error ' + e);
    return;
  }
};