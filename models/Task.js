const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  dueDate: Date,
  status: {
    type: String,
    enum: ['Open','In Progress', 'Completed'],
    default: 'Open'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
