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

// @desc Get all pets by user ID
exports.getPetsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const pets = await Pet.find({ ownerId: userId }).populate('ownerId', 'name email');
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
    // Populate ownerId for consistency
    const populatedPet = await Pet.populate(pet, { path: 'ownerId', select: 'name email' });
    res.json({ message: 'Pet deleted successfully', pet: populatedPet });
  } catch (err) {
    next(err);
  }
};

// Add a schedule to a pet's passport
exports.addScheduleToPassport = async (req, res, next) => {
  try {
    const petId = req.params.id;
    const schedule = req.body;
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Ensure passport and schedules array exist
    if (!pet.passport) {
      pet.passport = { schedules: [] };
    }
    if (!Array.isArray(pet.passport.schedules)) {
      pet.passport.schedules = [];
    }

    // Push via document API so Mongoose applies defaults and generates _id
    pet.passport.schedules.push(schedule);
    await pet.save();

    const addedSchedule = pet.passport.schedules[pet.passport.schedules.length - 1];
    res.status(201).json(addedSchedule);
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

// Add a petCare record
exports.addPetCare = async (req, res, next) => {
  try {
    const petId = req.params.id;
    const care = req.body;
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Ensure petCare array exists
    if (!Array.isArray(pet.petCare)) {
      pet.petCare = [];
    }

    // Push via document API so Mongoose applies defaults and generates _id
    pet.petCare.push(care);
    await pet.save();

    const addedCare = pet.petCare[pet.petCare.length - 1];
    res.status(201).json(addedCare);
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

// Update a petCare record
exports.updatePetCare = async (req, res, next) => {
  try {
    const petId = req.params.id;
    const careId = req.params.careId;
    const update = req.body;
    const pet = await Pet.findOneAndUpdate(
      { _id: petId, 'petCare._id': careId },
      { $set: { 'petCare.$': update } },
      { new: true, runValidators: true }
    );
    if (!pet) {
      return res.status(404).json({ message: 'Pet or care record not found' });
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

// Delete a petCare record
exports.deletePetCare = async (req, res, next) => {
  try {
    const petId = req.params.id;
    const careId = req.params.careId;
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    const careExists = pet.petCare.id(careId);
    if (!careExists) {
      return res.status(404).json({ message: 'Care record not found' });
    }
    const updatedPet = await Pet.findByIdAndUpdate(
      petId,
      { $pull: { petCare: { _id: careId } } },
      { new: true }
    );
    res.json(updatedPet);
  } catch (err) {
    next(err);
  }
};

// Update a schedule in a pet's passport
exports.updateScheduleInPassport = async (req, res, next) => {
  try {
    const petId = req.params.id;
    const scheduleId = req.params.scheduleId;
    const update = req.body;
    const pet = await Pet.findOneAndUpdate(
      { _id: petId, 'passport.schedules._id': scheduleId },
      { $set: { 'passport.schedules.$': update } },
      { new: true, runValidators: true }
    );
    if (!pet) {
      return res.status(404).json({ message: 'Pet or schedule not found' });
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

// Delete a schedule from a pet's passport
exports.deleteScheduleInPassport = async (req, res, next) => {
  try {
    const petId = req.params.id;
    const scheduleId = req.params.scheduleId;
    // First, check if the pet and schedule exist
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    const scheduleExists = pet.passport.schedules.id(scheduleId);
    if (!scheduleExists) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    // Now perform the removal
    const updatedPet = await Pet.findByIdAndUpdate(
      petId,
      { $pull: { 'passport.schedules': { _id: scheduleId } } },
      { new: true }
    );
    res.json(updatedPet);
  } catch (err) {
    next(err);
  }
};

// Add a medical record
exports.addMedicalRecord = async (req, res, next) => {
  try {
    const petId = req.params.id;
    const record = req.body;
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Ensure medicalRecords array exists
    if (!Array.isArray(pet.medicalRecords)) {
      pet.medicalRecords = [];
    }

    // Push via document API so Mongoose applies defaults and generates _id
    pet.medicalRecords.push(record);
    await pet.save();

    const addedRecord = pet.medicalRecords[pet.medicalRecords.length - 1];
    res.status(201).json(addedRecord);
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

// Update a medical record
exports.updateMedicalRecord = async (req, res, next) => {
  try {
    const petId = req.params.id;
    const recordId = req.params.recordId;
    const update = req.body;
    const pet = await Pet.findOneAndUpdate(
      { _id: petId, 'medicalRecords._id': recordId },
      { $set: { 'medicalRecords.$': update } },
      { new: true, runValidators: true }
    );
    if (!pet) {
      return res.status(404).json({ message: 'Pet or medical record not found' });
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

// Delete a medical record
exports.deleteMedicalRecord = async (req, res, next) => {
  try {
    const petId = req.params.id;
    const recordId = req.params.recordId;
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    const recordExists = pet.medicalRecords.id(recordId);
    if (!recordExists) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    const updatedPet = await Pet.findByIdAndUpdate(
      petId,
      { $pull: { medicalRecords: { _id: recordId } } },
      { new: true }
    );
    res.json(updatedPet);
  } catch (err) {
    next(err);
  }
};

// Add a petId record
exports.addPetId = async (req, res, next) => {
  try {
    const petId = req.params.id;
    const idRecord = req.body;
    const pet = await Pet.findByIdAndUpdate(
      petId,
      { $push: { petIds: idRecord } },
      { new: true, runValidators: true }
    );
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.status(201).json(pet);
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

// Update a petId record
exports.updatePetId = async (req, res, next) => {
  try {
    const petId = req.params.id;
    const idRecordId = req.params.petIdRecordId;
    const update = req.body;
    const pet = await Pet.findOneAndUpdate(
      { _id: petId, 'petIds._id': idRecordId },
      { $set: { 'petIds.$': update } },
      { new: true, runValidators: true }
    );
    if (!pet) {
      return res.status(404).json({ message: 'Pet or petId record not found' });
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

// Delete a petId record
exports.deletePetId = async (req, res, next) => {
  try {
    const petId = req.params.id;
    const idRecordId = req.params.petIdRecordId;
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    const idExists = pet.petIds.id(idRecordId);
    if (!idExists) {
      return res.status(404).json({ message: 'Pet ID record not found' });
    }
    const updatedPet = await Pet.findByIdAndUpdate(
      petId,
      { $pull: { petIds: { _id: idRecordId } } },
      { new: true }
    );
    res.json(updatedPet);
  } catch (err) {
    next(err);
  }
};

