const express = require('express');
const router = express.Router();
const { getPets, addPet, deletePet, getPetById, updatePet} = require('../controllers/petController');
const { petSchema } = require('../validators/petValidator');
const validate = require('../middleware/validate');

router.get('/', getPets);
router.get('/:id', getPetById);
router.post('/', validate(petSchema), addPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

module.exports = router;
