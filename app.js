const path = require('path')
const cors = require('cors')
const createError = require('http-errors')
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

// db requires
const mongoose = require('mongoose')
const dbConfig = require('./db/mongo')
const { User } = require('./db/models/user')

// passport requires
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const googleAuth = require('./constants/google.auth')

// routers
const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')

const app = express()
mongoose.connect(
  dbConfig.uri,
  { useNewUrlParser: true },
  (error) => console.error(error),
)

mongoose.connection.once('open', () => console.info('db connected!'))

const googleStrategyCallback = (accessToken, refreshToken, profile, done) =>
  User.findOrCreate({ googleID: profile.id }, {
    googleID: profile.id,
    name: profile.displayName,
    photos: profile.photos,
  }, done)

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) =>
  User.findById(id, (err, user) => (
    err ? done(err) : done(null, user)
  )),
)

passport.use(
  new GoogleStrategy(
    googleAuth.config,
    googleStrategyCallback,
  ),
)

app.use('/static', express.static(path.join(__dirname, './client/build/static')))
app.use('/favicon.ico', express.static(path.join(__dirname, './client/build/favicon.ico')))
app.use('/service-worker.js', express.static(path.join(__dirname, './client/build/service-worker.js')))
app.set('views', path.join(__dirname, 'views'))

app.set('view engine', 'pug')
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cookieParser())
app.use(session({
  secret: 's3Cur3',
  saveUninitialized: false,
  resave: true,
}))
app.use(passport.initialize())
app.use(cors({ origin: '*' }))
app.use(passport.session())
app.use((req, res, next) => {
  next()
})

app.use('/auth', authRouter)
app.use('/users', usersRouter)

app.get('*', function (req, res) {
  console.info(' -- ' + express.static(path.join(__dirname, './client/build/static')))
  res.sendFile(path.join(__dirname, './client/build', 'index.html'))
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
