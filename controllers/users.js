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

exports.signIn = function (req, res) {
  Users.findOne({ username: req.body.username }).exec((err, user) => {
    if (user == null) {
      res.setHeader("Content-Type", "application/json");
      res.status(403).send();
    } else {
      user.passwordIsCorrect(req.body.password, (err, isMatch) => {
        if (err) {
          res.setHeader("Content-Type", "application/json");
          res.status(500).send();
          return;
        }
        if (!isMatch) {
          res.setHeader("Content-Type", "application/json");
          res.status(403).send();
          return;
        }
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(user);
      });
    }
  });
};
