var Posts = require('../models/posts');

exports.insert = function (req, res) {
  var postData = req.body;
  if (postData == null) {
    res.status(403).send('No Data sent');
  }
  var number;
  switch(postData){
    case (postData.image1 == null):
      number = 0;
      break;
    case (postData.image2 == null):
      number = 1;
      break;
    case (postData.image3 == null):
      number = 2;
      break;
    case (postData.image4 == null):
      number = 3;
      break;
    default:
      number = 4;
  }

  try {
    var post = new Posts({
      user_id: postData.id,
      imageNo: number,
      text: postData.text
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