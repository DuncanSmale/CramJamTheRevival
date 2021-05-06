const mongoose = require('mongoose')
const { Schema } = mongoose

// Group Schema
const pollSchema = new Schema({
  name: { type: String, required: true },
  action: { type: String, enum: ['Remove', 'Add'], required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'StudentProfile', voted: { type: String, enum: ['Yes', 'No', ''], default: '' } }],
  group: { type: Schema.Types.ObjectId, ref: 'Group' },
  active: { type: Boolean, default: true, required: true }
})

module.exports.Poll = mongoose.model('Poll', pollSchema)
