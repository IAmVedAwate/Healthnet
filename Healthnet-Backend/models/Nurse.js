// models/Nurse.js
const mongoose = require('mongoose');

const nurseSchema = new mongoose.Schema({
  nurseID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  isAvailable: { type: Boolean, required: true },
  contactInfo: { type: String, required: true },
  hospital: { type: String, required: true }  // Changed from ObjectId to String (custom hospitalID)
});

module.exports = mongoose.model('Nurse', nurseSchema);
