const mongoose = require("mongoose")

const Schema = mongoose.Schema

// Tokens last 2 minutes
const tokenLifetime = 1000 /*sec*/ * 60 /*min*/ * 2

const Session = new Schema({
  token: { type: String, default: require("crypto").randomBytes(48).toString('hex'), required: true },
  expiry: { type: Date, default: Date.now() + tokenLifetime, required: true },
  user: { type: Schema.Types.ObjectID, ref: "User", required: true }
})

const sessionModel = mongoose.model("Session", Session)

module.exports = sessionModel
