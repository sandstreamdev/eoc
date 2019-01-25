const express = require('express');

const router = express.Router();

const {
  deleteUserById,
  getUserById,
  updateUser
} = require('../controllers/user');

// Get user by id
router.get('/:id', getUserById);

// Delete user by id
router.delete('/:id/delete', deleteUserById);

// Update user by id
router.patch('/:id/update', updateUser);

module.exports = router;
