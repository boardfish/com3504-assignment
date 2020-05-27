// Duplicated from users.js
const mongoose = require("mongoose")
var inputData = require("./usersStoriesAndRatings.json")
var User = require("./models/users")
var Story = require("./models/story")

mongoose.connect(
  process.env.MONGO_CONNECTION_STRING ||
    "mongodb://localhost:27017/development",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
let db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function () {
  // we're connected!
  console.log("Database connected")
  User.insertMany(
    inputData.users.map(({ userId }) => (
      {
        username: userId,
        password: 'password',
        email: `${userId}@sheffield.ac.uk`,
        nickname: userId
      }
    )),
    (err) => {
      if (err) { console.log(err) }
      User.count({}, function(err, userCount) {
        console.log( userCount );
        Promise.all(
          inputData.stories.map(async ({ userId, text }) => ({
            user: await User.findOne({ username: userId }),
            text: text
          }))
        ).then(stories => {
          Story.insertMany(
            stories,
            (err) => {
              if (err) { console.log(err) }
              Story.count({}, function(err, storyCount) {
                console.log( storyCount );
                return mongoose.disconnect()
              })
            }
          )
        })
      })
    }
  )
})
