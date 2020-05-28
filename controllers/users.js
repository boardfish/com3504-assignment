var Users = require("../models/users")

/**
 * This controller action creates a new user with the supplied JSON data. A
 * username, password, email and nickname should be supplied.
 * @param {Request} req a Request object
 * @param {Response} res a Response object
 */
exports.insert = function (req, res) {
  var userData = req.body
  if (userData == null) {
    res.status(403).send("No data sent!")
  }
  try {
    var user = new Users({
      username: userData.username,
      password: userData.password,
      email: userData.email,
      nickname: userData.nickname,
    })

    console.log("received + " + user)

    user.save(function (err, user) {
      console.log(user._id)
      if (err) {
        res.status(500).send("Invalid data!")
        return
      }
      res.setHeader("Content-Type", "application/json")
      res.send(JSON.stringify(user))
    })
  } catch (e) {
    res.status(500).send("error" + e)
  }
}
