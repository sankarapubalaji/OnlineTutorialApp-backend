const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { sendQuizEmail } = require('../utils/email');

// POST: Create a new quiz and send email to assigned students
router.post('/', async (req, res) => {
  const { title, dueDate, duration, description, quizUrl, createdBy, assignedStudents } = req.body;

  if (!title || !dueDate || !duration || !description || !quizUrl || !createdBy || !assignedStudents) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const teacher = await User.findById(createdBy).select('name email');
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const students = await User.find({ _id: { $in: assignedStudents } }).select('name email');
    if (students.length !== assignedStudents.length) {
      return res.status(404).json({ error: 'One or more students not found' });
    }

    const quiz = new Quiz({
      title,
      dueDate,
      duration,
      description,
      quizUrl,
      createdBy,
      assignedStudents,
    });
    const savedQuiz = await quiz.save();
    console.log('Quiz saved:', savedQuiz);

    const emailResults = [];
    for (const student of students) {
      const subject = `New Quiz Assigned: ${title}`;
      const quizDetails = {
        title,
        dueDate,
        duration,
        description,
        quizUrl,
      };
      try {
        await sendQuizEmail(
          student.email,
          subject,
          quizDetails,
          teacher.name,
          'teacher',
          teacher.email,
          student.name
        );
        emailResults.push({ studentId: student._id, status: 'sent', email: student.email, success: true });
        console.log(student.name);
      } catch (emailError) {
        console.error(`Failed to send email to ${student.email}:`, emailError);
        emailResults.push({ studentId: student._id, status: 'failed', error: emailError.message, email: student.email, success: false });
      }
    }

    // Convert savedQuiz to a plain JavaScript object
    const quizResponse = savedQuiz.toObject();
    res.status(201).json({ quiz: quizResponse, emailResults });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// GET: Fetch quizzes created by a teacher or assigned to a student
// GET: Fetch quizzes created by a teacher or assigned to a student
router.get('/', async (req, res) => {
  const { userId, role } = req.query;

  if (!role) {
    return res.status(400).json({ error: 'role is required' });
  }

  try {
    let quizzes;
    if (role === 'teacher') {
      if (!userId) {
        return res.status(400).json({ error: 'userId is required for teacher role' });
      }
      quizzes = await Quiz.find({ createdBy: userId }).populate('assignedStudents', 'name');
    } else if (role === 'student') {
      if (!userId) {
        // Instead of throwing an error, return an empty array or a message
        return res.status(200).json([]); // Or res.status(400).json({ error: 'userId is missing' });
      }
      // Ensure userId is treated as ObjectId for MongoDB query
      const objectId = new mongoose.Types.ObjectId(userId);
      quizzes = await Quiz.find({ assignedStudents: objectId });
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }

    if (!quizzes.length) {
      return res.status(404).json({ message: 'No quizzes found' });
    }

    console.log(`Fetched quizzes for user ${userId} (${role}):`, quizzes);
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

module.exports = router;