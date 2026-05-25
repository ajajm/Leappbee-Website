const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['long-form', 'short-form'],
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Video', videoSchema);
