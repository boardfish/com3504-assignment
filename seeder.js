// Duplicated from users.js
const mongoose = require("mongoose")
var inputData = require("./usersStoriesAndRatings.json")
var User = require("./models/users")
var Story = require("./models/story")
var Likes = require("./models/likes")

// Takes a story's text and returns the first matching ID
const findStoryById = (id) =>
  inputData.stories.find((story) => story.storyId === id)

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
    inputData.users.map(({ userId }) => ({
      username: userId,
      password: "password",
      email: `${userId}@sheffield.ac.uk`,
      nickname: userId,
    })),
    (err) => {
      if (err) {
        console.log(err)
      }
      User.count({}, function (err, userCount) {
        console.log(userCount, inputData.users.length)
        Promise.all(
          inputData.stories.map(async ({ userId, text }) => ({
            user: await User.findOne({ username: userId }),
            text: text,
          }))
        ).then((stories) => {
          Story.insertMany(stories, (err) => {
            if (err) {
              console.log(err)
            }
            Story.count({}, function (err, storyCount) {
              console.log(storyCount, inputData.stories.length)
              Promise.all(
                inputData.users.map(async ({ userId, ratings }) => {
                  var user = await User.findOne({ username: userId })
                  return Promise.all(
                    ratings.map(async ({ storyId, rating }) => ({
                      user,
                      story: await Story.findOne({
                        text: findStoryById(storyId).text,
                      }), // TODO }),
                      vote: rating - 1,
                    }))
                  )
                })
              )
                .then((likes) => {
                  Likes.insertMany([].concat.apply([], likes), (err) => {
                    if (err) {
                      console.log(err)
                    }
                    Likes.count({}, function (err, likesCount) {
                      console.log(
                        likesCount,
                        [].concat.apply(
                          [],
                          inputData.users.map(({ ratings }) => ratings)
                        ).length
                      )
                      return mongoose.disconnect()
                    })
                  })
                })
                .catch((err) => {
                  console.log(err)
                  return mongoose.disconnect()
                })
            })
          })
        })
      })
    }
  )
})
