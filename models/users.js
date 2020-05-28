/**
 * The user model represents an account for a user of the site. They have a
 * username, nickname, email address and password. The username and password are
 * used to log in to the site.
 */

const mongoose = require("mongoose")

const Schema = mongoose.Schema

const bcrypt = require("bcrypt")

const User = new Schema({
  username: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 200 },
  nickname: { type: String },
})

/**
 * Before saving the user, their password must be hashed for security.
 */
// Can't use arrow functions here - they prevent binding `this`
User.pre("save", function (next) {
  // only hash the password if it has been modified (or is new)
  var user = this
  if (!(user.isModified("password") || user.isNew())) {
    return next()
  }

  // generate a salt
  bcrypt.genSalt((err, salt) => {
    if (err) return next(err)

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)

      // override the cleartext password with the hashed one
      user.password = hash
      console.log(hash, user.password)
      next()
    })
  })
})

/**
 * This function checks that a given password matches the one that the user
 * originally set. It is used in Passport login events to verify inputs.
 * @param {string} passwordInput the password input to compare with the user's
 * @param {function} callback a callback function
 * @returns {function} callback
 */
User.methods.passwordIsCorrect = function (passwordInput, callback) {
  bcrypt.compare(passwordInput, this.password, function (err, isMatch) {
    if (err) {
      return callback(err)
    }
    return callback(null, isMatch)
  })
}

const userModel = mongoose.model("User", User)

module.exports = userModel
