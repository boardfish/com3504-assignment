const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Likes = new Schema(
  {
    like_id: {type: Number},
    story_id: {type: Schema.Types.ObjectID, required: true, ref: 'Post'},
    vote: {type: Number, required: true, max:4, min:0}
  }

);

const likeModel = mongoose.model('Likes', Likes);

module.exports = likeModel;