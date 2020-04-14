const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Likes = new Schema(
  {
    like_id: {type: Number},
    user_id: {type: Number, required: true},
    user_post: {type: Number, required: true},
    like_value: {type: Number, required: true, max:4, min:0}
  }

);

const likeModel = mongoose.model('Likes', Likes);

module.exports = likeModel;