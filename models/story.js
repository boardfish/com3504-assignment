var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Post = new Schema(
  {
    storyId: {type:Number, required: true},
    userId: {type: Schema.Types.ObjectID, ref: 'User', required: true},
    text: {type: String, max: 200},
    likes: {type:Array}
  }
);

const postModel = mongoose.model('Post', Post);

module.exports = postModel;