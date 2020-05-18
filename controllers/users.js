var Users = require("../models/users");

exports.insert = function (req, res) {
  var userData = req.body;
  if (userData == null) {
    res.status(403).send("No data sent!");
  }
  try {
    var user = new Users({
      username: userData.username,
      password: userData.password,
      email: userData.email,
      nickname: userData.nickname,
    });

    console.log("received + " + user);

    user.save(function (err, user) {
      console.log(user._id);
      if (err) {
        res.status(500).send("Invalid data!");
        return;
      }
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(user));
    });
  } catch (e) {
    res.status(500).send("error" + e);
  }
};