const User = require('../models/User');
const mongoose = require('mongoose');

// @desc Get all users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password'); // Exclude password from response
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// @desc Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// @desc Create a new user
exports.createUser = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    const userResponse = savedUser.toObject();
    delete userResponse.password; // Remove password from response
    
    res.status(201).json(userResponse);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'Email already exists',
        field: 'email'
      });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: Object.values(err.errors).map(e => e.message) 
      });
    }
    next(err);
  }
};

// @desc Update user
exports.updateUser = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'Email already exists',
        field: 'email'
      });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: Object.values(err.errors).map(e => e.message) 
      });
    }
    next(err);
  }
};

// @desc Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc Get user by email
exports.getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// @desc Update user role
exports.updateUserRole = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const { role } = req.body;
    if (!['user', 'admin', 'veterinarian'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};
