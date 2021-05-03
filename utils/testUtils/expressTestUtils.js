const express = require('express')
const path = require('path')
const mainRouter = require('../../src/routes/mainRoutes')
const meetingRouter = require('../../src/routes/meetingRoutes')
const groupRouter = require('../../src/routes/groupRoutes')
const studentRouter = require('../../src/routes/studentsRoutes')

const { settings } = require('../sessionSettings')
const { StudentProfile } = require('../../src/db/studentProfiles')

const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalPassport = require('passport-local')

const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../../views'))
app.use(express.static(path.join(__dirname, '../../public')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session(settings)) // creating session tokens
app.use(flash()) // adding flash
app.use(passport.initialize()) // initialise passort
app.use(passport.session()) // add passport login between sessions

passport.use(new LocalPassport(StudentProfile.authenticate())) // use a local storage strategy
passport.serializeUser(StudentProfile.serializeUser()) // function added by passport-local-mongoose
passport.deserializeUser(StudentProfile.deserializeUser()) // function added by passport-local-mongoose

app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.signedInUser = req.user
  next()
})
app.use('/', mainRouter)
app.use('/students', studentRouter)
app.use('/groups', groupRouter)
app.use('/meetings', meetingRouter)

module.exports.app = app
