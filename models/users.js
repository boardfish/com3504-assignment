const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema({
  username: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 200 },
  nickname: { type: String },
});

// Can't use arrow functions here - they prevent binding `this`
User.methods.passwordIsCorrect = function (passwordInput) {
  return (this.password === passwordInput);
}

const userModel = mongoose.model("User", User);

module.exports = userModel;
