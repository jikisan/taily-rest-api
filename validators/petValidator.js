const Joi = require('joi');

const petSchema = Joi.object({
  name: Joi.string().required(),
  species: Joi.string().required(),
  birthDate: Joi.date().optional(),
  vaccines: Joi.array().items(Joi.string()).optional(),
  photoUrl: Joi.string().uri().optional()
});

module.exports = { petSchema };
