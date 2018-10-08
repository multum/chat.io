const mongoose = require('mongoose')
const { userSchema } = require('../models/user')
const Schema = mongoose.Schema

const roomSchema = new Schema({
  members: [ mongoose.Schema.Types.ObjectId ],
})

userSchema.methods.toClient = function () {
  const obj = this.toObject()

  //Rename fields
  obj.id = obj._id
  delete obj._id

  return obj
}

const Room = mongoose.model('Room', roomSchema)

module.exports = {
  Room,
}
