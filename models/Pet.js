const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  vaccineType: { type: String, required: true },
  hospital: { type: String },
  schedDateTime: { type: Date, required: true },
  notes: { type: String },
  given: {
    isGiven: { type: Boolean, default: false },
    type: { type: String },
    dateTime: { type: Date },
    proofPhoto: { type: String }
  },
  weight: {
    value: { type: Number },
    unit: { type: String, enum: ['kg', 'lbs', 'g', 'oz'] }
  },
  vet: { type: String }
});

const groomingSchema = new mongoose.Schema({
  careType: { type: String, required: true },
  clinic: { type: String },
  groomingDateTime: { type: Date, required: true },
  notes: { type: String },
  groomed: {
    isGroomed: { type: Boolean, default: false },
    groomedDateTime: { type: Date },
    referencePhoto: { type: String }
  },
  weight: {
    value: { type: Number },
    unit: { type: String, enum: ['kg', 'lbs', 'g', 'oz'] }
  },
  groomer: { type: String }
});

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
  }],
  passport: {
    schedules: [scheduleSchema]
  },
  petCare: [groomingSchema]
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);
