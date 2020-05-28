var Users = require("../models/users")

/**
 * This controller action creates a new user with the supplied JSON data. A
 * username, password, email and nickname should be supplied.
 * @param {Request} req a Request object
 * @param {Response} res a Response object
 * @memberof User
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
      if (err) {
        console.log(err.errors)
        switch (true) {
          case (err.code === 11000):
            res.status(400).send("A user with this username exists already.")
            break
          case (err.name === 'ValidationError'):
            res.status(400).send(`The following fields aren't valid: ${Object.values(err.errors).map(({message}) => message)}`)
            break
          default:
            console.log(err.name)
            res.status(500).send()
        }
        return
      }
      res.setHeader("Content-Type", "application/json")
      res.send(JSON.stringify(user))
    })
  } catch (e) {
    res.status(500).send("error" + e)
  }
}
