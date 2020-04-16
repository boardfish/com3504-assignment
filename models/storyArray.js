const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StoryArray = new Schema[(
  {
    storyId: {type:Number},
    userId: {type: Number},
    text: {type: String},
    likes: {type: Array}
  }
)];

const storyArrayModel = mongoose.model('Story Arrays', StoryArray);

module.exports = storyArrayModel;