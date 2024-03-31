const mongoose = require("mongoose")

const assignmentSchema = new mongoose.Schema({
  sub_name: {
    type: String,
    required: [true, "Please Enter Subject  Name"],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "Please Enter author name"],
    trim: true,
  },
  sem: {
    type: String,
    required: [true, "Please Enter Semester name"],
    trim: true,
  },
  description: {
    type: String,
    // required: [true, 'Please Enter product Description'],
  },
  likes: [{ email: String }],
  dislikes: [{ email: String }],
  views: [{ email: String }],
  year: {
    type: Number,
    maxLength: [4, "Enter Year"],
  },
  pdf: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },
  assignment_no: {
    require: [true, "Assignment Number must be provided"],
    type: String,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("assignmentSchema", assignmentSchema)
