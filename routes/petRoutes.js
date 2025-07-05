const express = require('express');
const router = express.Router();
const {
  addPetId,
  updatePetId,
  deletePetId,
  getPets,
  getPetById,
  getPetsByUserId,
  addPet,
  updatePet,
  deletePet,
  addScheduleToPassport,
  addPetCare,
  updatePetCare,
  deletePetCare,
  updateScheduleInPassport,
  deleteScheduleInPassport,
  addMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord
} = require('../controllers/petController');

router.get('/', getPets);
router.get('/user/:userId', getPetsByUserId);
router.get('/:id', getPetById);
router.post('/', addPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

// Passport/Schedule endpoints
router.post('/:id/passport/schedules', addScheduleToPassport);
router.put('/:id/passport/schedules/:scheduleId', updateScheduleInPassport);
router.delete('/:id/passport/schedules/:scheduleId', deleteScheduleInPassport);

// PetCare endpoints
router.post('/:id/petCare', addPetCare);
router.put('/:id/petCare/:careId', updatePetCare);
router.delete('/:id/petCare/:careId', deletePetCare);

// MedicalRecords endpoints
router.post('/:id/medicalRecords', addMedicalRecord);
router.put('/:id/medicalRecords/:recordId', updateMedicalRecord);
router.delete('/:id/medicalRecords/:recordId', deleteMedicalRecord);

// PetIds endpoints
router.post('/:id/petIds', addPetId);
router.put('/:id/petIds/:petIdRecordId', updatePetId);
router.delete('/:id/petIds/:petIdRecordId', deletePetId);

module.exports = router;
