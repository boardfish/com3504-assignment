var socket = io();
//var story = require('../../controllers/story');

function sendText() {
  try {
    console.log("Should be saving story");
    socket.emit('saveStory', 'test');
  } catch (e) {
    res.status(500).send("error" + e);
  }
  return false;

}

socket.on('updatechat', function (message){
  //var storyToAdd = story.getStory(req, res);
  var storyToAdd = 2;
  var storyBox = document.getElementById('newest');
  console.log("Update is running");
  storyBox.innerHTML = '</br>'+ storyToAdd
  //This is where the code will be added to update the story
});