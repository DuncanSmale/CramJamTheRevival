const mongoose = require('mongoose')
const { Schema } = mongoose

// Link Schema
const linkSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'StudentProfile' },
  group: { type: Schema.Types.ObjectId, ref: 'Group' }
})

module.exports.LinkSchema = mongoose.model('Link', linkSchema)
