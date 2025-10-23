const express = require('express');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin'); // You'll create this
const User = require('../models/user');

const router = express.Router();

// Protect all admin routes
router.use(protect);

// GET /api/admin/users - Get all users (Admin only)
router.get('/users', async (req, res) => {
  try {
    // For now, allow any authenticated user to see all users
    const users = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;