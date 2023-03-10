const catchAsync = require('../../utils/catchAsync')
const survey = require('../controllers/survey')
const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('../middleware/middleware')

router.route('/:student')
  .post(catchAsync(survey.takeSurvey))

router.route('/')
  .get(isLoggedIn, survey.showSurvey)

module.exports = router
