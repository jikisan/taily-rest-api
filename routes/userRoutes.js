const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  getUserByEmail,
  updateUserRole
} = require('../controllers/userController');

// Basic CRUD routes
router.get('/', getUsers);
router.get('/email/:email', getUserByEmail); // Must come before /:id
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Additional routes
router.patch('/:id/role', updateUserRole);

module.exports = router;
