/**
 * The Story model represents a post on the site. It has an author (user), text
 * content, and associated ratings (likes).
 * @module Story
 */

var mongoose = require("mongoose")

var Schema = mongoose.Schema

var Story = new Schema(
  {
    user: { type: Schema.Types.ObjectID, ref: "User", required: true },
    text: { type: String, max: 200 },
    likes: [{ type: Schema.Types.ObjectID, ref: "Like", required: true }],
  },
  { timestamps: true }
)

const storyModel = mongoose.model("Story", Story)

module.exports = storyModel
