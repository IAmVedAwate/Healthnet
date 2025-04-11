const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contactInfo: { type: String, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
  status: { type: String, default: 'Pending' }  // e.g., Pending, Under Treatment, Discharged
});

module.exports = mongoose.model('Patient', patientSchema);
