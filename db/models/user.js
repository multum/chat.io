const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  googleID: String,
  name: String,
  photos: Array,
})

userSchema.statics.findOrCreate = function (findOptions, createOptions, cb) {
  const User = this.model('User')
  return User.findOne(findOptions, (err, user) => {
    if (err) {
      return cb(err)
    }
    if (user) {
      return cb(null, user)
    } else {
      return User.create(createOptions, cb)
    }
  })
}

userSchema.methods.toClient = function () {
  const obj = this.toObject()

  //Rename fields
  obj.id = obj._id
  delete obj._id

  return obj
}

const User = mongoose.model('User', userSchema)

module.exports = {
  User,
  userSchema,
}
