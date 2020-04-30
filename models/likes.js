const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Like = new Schema({
  story: { type: Schema.Types.ObjectID, required: true, ref: "Story" },
  vote: { type: Number, required: true, max: 4, min: 0 },
});

const likeModel = mongoose.model("Like", Like);

module.exports = likeModel;
