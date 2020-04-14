var Likes = require('../models/likes');

exports.insert = function (req, res) {
  var likeData = req.body;
  if (likeData == null) {
    res.status(403).send('No Data Sent!')
  }
  try{
    var like = new Likes({
      like_id: likeData.likeid,
      user_id: likeData.userid,
      user_post: likeData.userPost,
      like_value: likeData.likevalue
    });
    console.log('received: ' + like);

    like.save(function(err, results) {
      console.log(results._id);
      if (err)
        res.status(500).send('invalid data!');
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(character));
    });

  } catch (e) {
    res.status(500).send('error' + e);
  }
}