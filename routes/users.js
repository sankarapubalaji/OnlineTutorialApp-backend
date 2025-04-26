const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/users?role=student|teacher - Fetch users based on the requested role
router.get('/', userController.getUsersByRole);

module.exports = router;