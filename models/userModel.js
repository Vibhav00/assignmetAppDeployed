const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    validate: [validator.isEmail, "Please Enter a valid Email"],
    unique: [true, "this email is already registered"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  phone: {
    type: String,
    required: [false, "please enter a valid phone number"],
    maxLength: [10, "phone number must be less than 10"],
    minLength: [10, "phone number must be greater than 10"],
  },
  follower: {
    type: [{ email: String }],
  },
  followings: {
    type: [{ email: String }],
  },
  avatar: {
    public_id: {
      type: String,
      // required: true,
    },
    url: {
      type: String,
      // required: true,
    },
  },
  verified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: Number,
  },
  assignments: [{ url: String }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  this.password = await bcrypt.hash(this.password, 10)
})

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// Compare Password

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex")

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

  this.resetPasswordExpire = Date.now() + 15 * 60 * 100000

  return resetToken
}

module.exports = mongoose.model("User", userSchema)
