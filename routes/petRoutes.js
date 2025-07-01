const express = require('express');
const router = express.Router();
const {
  getPets,
  getPetById,
  addPet,
  updatePet,
  deletePet,
  addScheduleToPassport,
  addPetCare,
  updatePetCare,
  deletePetCare,
  updateScheduleInPassport,
  deleteScheduleInPassport
} = require('../controllers/petController');

router.get('/', getPets);
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

module.exports = router;
