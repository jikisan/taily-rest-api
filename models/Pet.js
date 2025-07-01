const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photoUrl: { type: String },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  dateOfBirth: { type: Date },
  petType: { type: String, required: true },
  breed: { type: String },
  weight: {
    value: { type: Number },
    unit: { type: String, enum: ['kg', 'lbs', 'g', 'oz'] }
  },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  identifiers: {
    microchipNumber: { type: String },
    microchipLocation: { type: String },
    clipLocation: { type: String },
    size: { type: String },
    colorMarkings: { type: String },
    isNeuteredOrSpayed: { type: Boolean, default: false },
    allergies: [{ type: String }]
  },
  petIds: [{
    petId: { type: String },
    idName: { type: String },
    idUrl: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);
