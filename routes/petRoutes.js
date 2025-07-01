const express = require('express');
const router = express.Router();
const {
  getPets,
  getPetById,
  addPet,
  updatePet,
  deletePet,
  addScheduleToPassport
} = require('../controllers/petController');

router.get('/', getPets);
router.get('/:id', getPetById);
router.post('/', addPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

// Add schedule to passport
router.post('/:id/passport/schedules', addScheduleToPassport);

module.exports = router;
