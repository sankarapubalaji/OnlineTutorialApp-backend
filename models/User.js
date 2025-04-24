const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  eNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^e[0-9]{7}$/.test(v);
      },
      message: 'E-number must be "e" followed by 7 digits',
    },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, required: false }, // Changed to optional
  verificationTokenExpires: { type: Date, required: false }, // Changed to optional
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);