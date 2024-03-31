const ErrorHander = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ApiFeatures = require('../utils/apifeatures')
const Assignment = require('../models/assignmentModel')

// Create Assignmetn
exports.createAssignment = catchAsyncErrors(async (req, res, next) => {
  const { sub_name, sem, year, pdf, size, assignment_no } = req.body

  const obj = {
    sub_name,
    sem,
    year,
    pdf,
    size,
    assignment_no,
    author: req.user.email,
  }

  const assignment = await Assignment.create(obj)

  res.status(201).json({
    success: true,
    assignment,
  })
})

// get all Assignment
exports.getAllAssignments = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8
  const assignmentCount = await Assignment.countDocuments()

  const apiFeature = new ApiFeatures(Assignment.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage)

  // let assignments = await apiFeature.query

  // let filteredassignmentsCount = assignments.length

  // apiFeature.

  let assignments = await apiFeature.query

  res.status(200).json({
    success: true,
    assignments,
    assignmentCount,
    resultPerPage,
  })
})

// get unique Assignment
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id)

  console.log(req.params.id)

  if (!assignment) {
    return next(new ErrorHander('Product not found', 404))
  }

  res.status(200).json({
    success: true,
    assignment,
  })
})

//update assignment

exports.updateAssignmentDetails = catchAsyncErrors(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id)

  console.log(req.params.id)

  if (!assignment) {
    return next(new ErrorHander('Product not found', 404))
  }

  const { sub_name, sem, year, pdf, size, assignment_no } = req.body

  const obj = {
    sub_name,
    sem,
    year,
    pdf,
    size,
    assignment_no,
    author: req.user.email,
  }

  product = await Assignment.findByIdAndUpdate(req.params.id, obj, {
    new: true,
    runValidators: false,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
    assignment,
  })
})

// delete assignment
exports.deleteAssignment = catchAsyncErrors(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id)

  if (!assignment) {
    return next(new ErrorHander('Product not found', 404))
  }

  await assignment.remove()

  res.status(200).json({
    success: true,
    message: 'Product Delete Successfully',
  })
})

// increase likes
exports.updateLikes = catchAsyncErrors(async (req, res, next) => {
  let { like } = req.body

  const assignment = await Assignment.findById(req.params.id)
  if (like != '') {
    assignment.likes.forEach((element) => {
      if (element.email == like) {
        assignment.likes.pop({ email: like })
        like = null
      }
    })
    if (like != null) assignment.likes.push({ email: like })
  }
  await assignment.save({ validateBeforeSave: false })

  res.status(200).json({
    success: true,
    assignment,
  })
})

// increase views
exports.updateViews = catchAsyncErrors(async (req, res, next) => {
  let { view } = req.body

  console.log(view)
  const assignment = await Assignment.findById(req.params.id)
  if (view != '') {
    assignment.views.forEach((element) => {
      if (element.email == view) {
        view = null
      }
    })
    console.log(view)
    if (view != null) assignment.views.push({ email: view })
  }
  await assignment.save({ validateBeforeSave: false })

  res.status(200).json({
    success: true,
    assignment,
  })
})
