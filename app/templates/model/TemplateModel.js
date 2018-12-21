const mongoose = require('mongoose')

const TemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})
module.exports = mongoose.model('Template', TemplateSchema)
