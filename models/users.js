const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bcrypt = require("bcrypt");

const User = new Schema({
  username: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 200 },
  nickname: { type: String },
});

// Can't use arrow functions here - they prevent binding `this`
User.pre("save", function (next) {
  // only hash the password if it has been modified (or is new)
  var user = this;
  if (!(user.isModified("password") || user.isNew())) {
    return next()
  };

  // generate a salt
  bcrypt.genSalt((err, salt) => {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      console.log(hash, user.password)
      next();
    });
  });
});

User.methods.passwordIsCorrect = function (passwordInput, callback) {
  bcrypt.compare(passwordInput, this.password, function(err, isMatch) {
    if (err) { return callback(err) };
    return callback(null, isMatch);
  })
};

const userModel = mongoose.model("User", User);

module.exports = userModel;
