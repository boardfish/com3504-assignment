/**
 * The Like model represents a rating on a story. It has a story and a rating
 * from 0 to 4. This is represented as 1-5 in the frontend.
 * @module Like
 */

const mongoose = require("mongoose")

const Schema = mongoose.Schema

const Like = new Schema({
  story: { type: Schema.Types.ObjectID, required: true, ref: "Story" },
  vote: { type: Number, required: true, max: 4, min: 0 },
})

const likeModel = mongoose.model("Like", Like)

module.exports = likeModel
