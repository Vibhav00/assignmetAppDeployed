const express = require("express")
const ErrorHandler = require("./middlewares/error")
const rateLimit = require("express-rate-limit")
const cors = require("cors")
const app = express()
app.use(cors())
app.set("Access-Control-Allow-Origin", "*")

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
})
app.use("/api", limiter)

// require to parse cookies
const cookieParser = require("cookie-parser")

// route for user and resouces
const user = require("./routes/userRoute")
const assignment = require("./routes/assignmentRoute")

app.use(express.json())
app.use(cookieParser())

// user routes login signup
app.use("/api/v1/user", user)
// accessing assignment routes
app.use("/api/v1/assignment", assignment)

app.get("/", (req, res) => {
  res.json("Success ")
})

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

// Middleware for Errors = last
app.use(ErrorHandler)
module.exports = app
