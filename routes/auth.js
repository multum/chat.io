const express = require('express')
const passport = require('passport')
const R = require('ramda')
const rest = require('../helpers/rest')
const router = express.Router()
const toClient = (result) => result.toClient()

const getUser = R.compose(
  rest.toResponse,
  toClient,
  R.prop('user'),
)

router

  .get('/',
    passport.authenticate('google', {
      scope: [ 'https://www.googleapis.com/auth/plus.login' ],
      failureRedirect: '/',
    }),
  )

  .get(
    '/callback',
    passport.authenticate('google'),
    (req, res) => res.render('authCallback', { user: req.user.id }),
  )

  .get('/logout', (req, res) => {
    req.logout()
    res.send(rest.toResponse('Logout done!'))
  })

  .get('/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.send(getUser(req))
    } else {
      res.status(500).send({ error: 'Client is not authenticated' })
    }
  })

module.exports = router
