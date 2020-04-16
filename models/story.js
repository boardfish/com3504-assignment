var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Post = new Schema(
  {
    storyId: {type:Number, required: true},
    userId: {type: Number, required: true},
    text: {type: String, max: 200},
    likes: {type:Array}
  }
);

const postModel = mongoose.model('Post', Post);

module.exports = postModel;