const Joi = require('joi');

const petSchema = Joi.object({
  name: Joi.string().required(),
  photoUrl: Joi.string().uri().optional(),
  gender: Joi.string().valid('Male', 'Female').required(),
  dateOfBirth: Joi.date().optional(),
  petType: Joi.string().required(),
  breed: Joi.string().optional(),
  weight: Joi.object({
    value: Joi.number().optional(),
    unit: Joi.string().valid('kg', 'lbs', 'g', 'oz').optional()
  }).optional(),
  ownerId: Joi.string().required(), // Should be a valid ObjectId, but string is fine for basic validation
  identifiers: Joi.object({
    microchipNumber: Joi.string().optional(),
    microchipLocation: Joi.string().optional(),
    clipLocation: Joi.string().optional(),
    size: Joi.string().optional(),
    colorMarkings: Joi.string().optional(),
    isNeuteredOrSpayed: Joi.boolean().optional(),
    allergies: Joi.array().items(Joi.string()).optional()
  }).optional(),
  petIds: Joi.array().items(
    Joi.object({
      petId: Joi.string().optional(),
      idName: Joi.string().optional(),
      idUrl: Joi.string().uri().optional()
    })
  ).optional()
});

module.exports = { petSchema };
