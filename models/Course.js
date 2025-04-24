const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructor: { type: String, required: true },
  category: { type: String, default: 'General' },
  duration: { type: String, default: 'Unknown' },
  level: { type: String, default: 'Beginner' },
  image: { type: String, required: true },
  description: { type: String, required: true },
  courseUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);