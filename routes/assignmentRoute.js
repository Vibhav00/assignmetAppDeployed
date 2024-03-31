const express = require('express')
const { isAuthenticatedUser } = require('../middlewares/auth')
const {
  createAssignment,
  getAllAssignments,
  getProductDetails,
  updateAssignmentDetails,
  updateLikes,
  updateViews,
} = require('../controllers/assignmentController')

const router = express.Router()

router
  .route('/')
  .post(isAuthenticatedUser, createAssignment)
  .get(isAuthenticatedUser, getAllAssignments)

router
  .route('/single/:id')
  .get(isAuthenticatedUser, getProductDetails)
  .put(isAuthenticatedUser, updateAssignmentDetails)

router.route('/likes/:id').put(isAuthenticatedUser, updateLikes)
router.route('/views/:id').put(isAuthenticatedUser, updateViews)

module.exports = router
