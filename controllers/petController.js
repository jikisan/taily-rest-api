const Pet = require('../models/Pet');
const mongoose = require('mongoose');

// @desc Get all pets
exports.getPets = async (req, res, next) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (err) {
    next(err);
  }
};

exports.getPetById = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);
    res.json(pet);
  } catch (err) {
    next(err);
  }
};

exports.addPet = async (req, res, next) => {
  try {
    const pet = new Pet(req.body);
    const savedPet = await pet.save();
    res.status(201).json(savedPet);
  } catch (err) {
    next(err);
  }
};

exports.updatePet = async (req, res, next) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pet);
  } catch (err) {
    next(err);
  }
};

exports.deletePet = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid pet ID' });
    }
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json(pet);
  } catch (err) {
    next(err);
  }
};

