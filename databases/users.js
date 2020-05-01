const mongoose = require("mongoose")
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
})
