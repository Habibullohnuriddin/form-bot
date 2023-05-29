const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  addedUserCount: {
    type: Number,
    default: 0
  },
  step: {
    type: Number,
    default: 0
  },
  username: {
    type: String,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  age: {
    type: Number,
  },
  location: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  whereIsFind: {
    type: String,
  },
  hasComputer: {
    type: String,
  },
  hasInternet: {
    type: String,
  },
  hasSoftware: {
    type: String,
  },
  isFulledInfo: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('User', userSchema)