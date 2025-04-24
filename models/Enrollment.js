const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  status: { type: String, enum: ['enrolled', 'in-progress', 'completed', 'discarded'], required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  completedAt: { type: Date },
  discardedAt: { type: Date },
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);