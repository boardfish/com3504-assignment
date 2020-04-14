var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Post = new Schema(
  {
    user_id: {type: Number, required: true},
    imageNo: {type: Number, required: true, max:4},
    image1: {type: String},
    image2: {type: String},
    image3: {type: String},
    image4: {type: String},
    text: {type: String, max: 200}
  }
);

const postModel = mongoose.model('Post', Post);

module.exports = postModel;