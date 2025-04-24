const express = require('express');
const router = express.Router();
const { getCourses, addCourse } = require('../controllers/courseController');

// Get all courses (no authentication required)
router.get('/', getCourses);

// Add a new course (no authentication required)
router.post('/', addCourse);

module.exports = router;