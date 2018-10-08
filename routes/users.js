const express = require('express')
const R = require('ramda')
const { User } = require('../db/models/user')
const rest = require('../helpers/rest')
const router = express.Router()

const toClient = (result) => result.toClient()

const usersToClient = R.compose(
  rest.toResponse,
  R.map(toClient),
)

router.get('/', function (req, res) {
  User.find({}, (err, users) => {
    if (users && users.length) {
      res.send(usersToClient(users))
    }
  })
})

router.post('/', function (req, res, next) {
  res.send(req.body)
})

module.exports = router
