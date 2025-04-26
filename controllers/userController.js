const User = require('../models/User');

// Fetch users based on the requested role
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query; // Get the role from query params (student or teacher)

    if (!role || !['student', 'teacher'].includes(role)) {
      return res.status(400).json({ message: 'Invalid or missing role parameter. Must be "student" or "teacher".' });
    }

    // Fetch users with the opposite role
    const targetRole = role === 'student' ? 'teacher' : 'student';
    const users = await User.find({ role: targetRole }).select('name email role');

    if (!users || users.length === 0) {
      return res.status(404).json({ message: `No ${targetRole}s found.` });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};