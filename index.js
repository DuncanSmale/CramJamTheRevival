const path = require('path')
const express = require('express')

// loading routers
const mainRouter = require('./src/routes/mainRoutes')
const meetingRouter = require('./src/routes/meetingRoutes')
const groupRouter = require('./src/routes/groupRoutes')
const studentRouter = require('./src/routes/studentsRoutes')

const db = require('./src/db')
const { settings } = require('./utils/sessionSettings')
const { StudentProfile } = require('./src/db/studentProfiles')

const app = express()
const ejsMate = require('ejs-mate')
const session = require('express-session')
const passport = require('passport')
const LocalPassport = require('passport-local')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(session(settings)) // creating session tokens
app.use(passport.initialize()) // initialise passort
app.use(passport.session()) // add passport login between sessions

passport.use(new LocalPassport(StudentProfile.authenticate())) // use a local storage strategy
passport.serializeUser(StudentProfile.serializeUser()) // function added by passport-local-mongoose
passport.deserializeUser(StudentProfile.deserializeUser()) // function added by passport-local-mongoose

const port = 3000

app.use('/', mainRouter)
app.use('/students', studentRouter)
app.use('/groups', groupRouter)
app.use('/meetings', meetingRouter)

app.listen(port)

console.log('Blast it Chewie 💫 Express server running on port', port)
