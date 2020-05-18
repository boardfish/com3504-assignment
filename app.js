var createError = require("http-errors")
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
var passport = require("passport")
var session = require("express-session")
var User = require("./models/users")
var LocalStrategy = require("passport-local").Strategy

var indexRouter = require("./routes/index")
var usersRouter = require("./routes/users")
var storiesRouter = require("./routes/stories")

var app = express()
var sass = require("node-sass-middleware")

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "/node_modules/bootstrap/dist")))
app.use(express.static(path.join(__dirname, "/node_modules/jquery/dist")))

app.use(
  sass({
    src: __dirname + "/sass", // Input SASS files
    dest: __dirname + "/public", // Output CSS
    debug: true,
  })
)

// Authentication - Passport
passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err)
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." })
      }
      user.passwordIsCorrect(password, (err, isCorrect) => {
        if (err) {
          return done(err)
        }
        if (!isCorrect) {
          return done(null, false, { message: "Incorrect password." })
        }
        return done(null, user)
      })
    })
  })
)

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})
app.use(session({ secret: "nodethings" }))
app.use(passport.initialize())
app.use(passport.session())

app.use("/", indexRouter)
app.use("/users", usersRouter)
app.use("/stories", storiesRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app
