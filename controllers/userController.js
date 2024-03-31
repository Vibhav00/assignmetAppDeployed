const ErrorHander = require("./../utils/errorHandler")
const catchAsyncErrors = require("./../middlewares/catchAsyncErrors")
const User = require("../models/userModel")
const sendToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body
  const otp = Math.floor(100000 + Math.random() * 900000)
  const user = await User.create({
    name,
    email,
    password,
    otp,
  })
  const message = `Your OTP for registration is: ${otp}`
  await sendEmail({
    email: user.email,
    subject: "OTP for Registration",
    message,
  })
  sendToken(user, 201, res)
})

//verify otp
exports.verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body

  try {
    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      return next(new ErrorHander("User not found", 404))
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return next(new ErrorHander("Invalid OTP", 400))
    }

    // Mark user as verified
    user.verified = true
    await user.save()

    res.status(200).json({
      success: true,
      message: "User verified successfully",
    })
  } catch (error) {
    return next(new ErrorHander(error.message, 500))
  }
})

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400))
  }

  const user = await User.findOne({ email }).select("+password")

  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401))
  }

  const isPasswordMatched = await user.comparePassword(password)

  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401))
  }

  sendToken(user, 200, res)
})
// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: "Logged Out",
  })
})

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new ErrorHander("User not found", 404))
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/resetpass/${resetToken}`

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    })

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    })
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorHander(error.message, 500))
  }
})

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  console.log(req.params)
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    )
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not password", 400))
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()

  sendToken(user, 200, res)
})

// update follower
exports.updateFollower = catchAsyncErrors(async (req, res, next) => {
  const { follow, following } = req.body
  console.log(following)
  console.log(follow)

  const user = await User.findById(req.user.id)
  if (following != "") {
    user.followings.push({ email: following })
  }
  if (follow != "") {
    user.follower.push({ email: follow })
  }
  await user.save({ validateBeforeSave: false })

  res.status(200).json({
    success: true,
    user,
  })
})
