const express = require("express")
const {
  registerUser,
  loginUser,
  verifyOTP,
  logout,
  forgotPassword,
  resetPassword,
  updateFollower,
} = require("../controllers/userController")
const { isAuthenticatedUser } = require("../middlewares/auth")
const router = express.Router()
router.route("/signin").post(loginUser)
router.route("/signup").post(registerUser)
router.route("/verify").post(verifyOTP)
router.route("/signout").get(logout)
router.route("/forgotpass").post(forgotPassword)
router.route("/resetpass/:token").put(resetPassword)
router.route("/updatefollower").post(isAuthenticatedUser, updateFollower)

module.exports = router
