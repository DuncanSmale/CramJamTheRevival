if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const path = require('path')
const express = require('express')

// loading routers
const mainRouter = require('./src/routes/mainRoutes')
const meetingRouter = require('./src/routes/meetingRoutes')
const groupRouter = require('./src/routes/groupRoutes')
const studentRouter = require('./src/routes/studentsRoutes')
const pollsRouter = require('./src/routes/poll')
const notificationsRouter = require('./src/routes/notifications')
const surveyRouter = require('./src/routes/survey')
const logRouter = require('./src/routes/activityLog')
const { logActivity } = require('./src/middleware/middleware')
const linkRouter = require('./src/routes/linkRoutes')

const methods = require('./src/controllers/functions.js') // path to functions.js

const db = require('./src/db')
const { settings } = require('./utils/sessionSettings')
const { StudentProfile } = require('./src/db/studentProfiles')

const app = express()
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalPassport = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize')
const { GroupSchema } = require('./src/db/groups')

const publicDir = path.join(__dirname, 'public')
const GROUP_LIMIT = 10

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(publicDir))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session(settings)) // creating session tokens
app.use(flash()) // adding flash
app.use(passport.initialize()) // initialise passort
app.use(passport.session()) // add passport login between sessions
app.use(mongoSanitize()) // removes special charachters from query strings like $ to prevent mongo injection

passport.use(new LocalPassport(StudentProfile.authenticate())) // use a local storage strategy
passport.serializeUser(StudentProfile.serializeUser()) // function added by passport-local-mongoose
passport.deserializeUser(StudentProfile.deserializeUser()) // function added by passport-local-mongoose

const port = process.env.PORT || 3000

app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.signedInUser = req.user
  res.locals.groupLimit = GROUP_LIMIT
  next()
})
app.all('*', logActivity)

app.use('/', mainRouter)
app.use('/students', studentRouter, express.static(publicDir))
app.use('/groups', groupRouter, express.static(publicDir))
app.use('/meetings', meetingRouter, express.static(publicDir))
app.use('/polls', pollsRouter, express.static(publicDir))
app.use('/log', logRouter, express.static(publicDir))
app.use('/notifications', notificationsRouter, express.static(publicDir))
app.use('/survey', surveyRouter, express.static(publicDir))
app.use('/links', linkRouter, express.static(publicDir))

app.listen(port)

console.log('Blast it Chewie 💫 Express server running on port', port)
