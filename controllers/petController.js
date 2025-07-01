const Pet = require('../models/Pet');
const mongoose = require('mongoose');

// @desc Get all pets
exports.getPets = async (req, res, next) => {
  try {
    const pets = await Pet.find().populate('ownerId', 'name email'); // Populate owner info
    res.json(pets);
  } catch (err) {
    next(err);
  }
};

// @desc Get pet by ID
exports.getPetById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid pet ID' });
    }
    
    const pet = await Pet.findById(req.params.id).populate('ownerId', 'name email');
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json(pet);
  } catch (err) {
    next(err);
  }
};

// @desc Add a new pet
exports.addPet = async (req, res, next) => {
  try {
    const pet = new Pet(req.body);
    const savedPet = await pet.save();
    const populatedPet = await Pet.findById(savedPet._id).populate('ownerId', 'name email');
    res.status(201).json(populatedPet);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: Object.values(err.errors).map(e => e.message) 
      });
    }
    next(err);
  }
};

// @desc Update pet
exports.updatePet = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid pet ID' });
    }
    
    const pet = await Pet.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('ownerId', 'name email');
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json(pet);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: Object.values(err.errors).map(e => e.message) 
      });
    }
    next(err);
  }
};

// @desc Delete pet
exports.deletePet = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid pet ID' });
    }
    
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json({ message: 'Pet deleted successfully', pet });
  } catch (err) {
    next(err);
  }
};

