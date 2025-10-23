const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  updateProfile,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/profile', updateProfile);
router.delete('/', deleteUser);

module.exports = router;