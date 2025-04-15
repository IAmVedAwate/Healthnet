const mongoose = require('mongoose');

const BedSchema = new mongoose.Schema({
  ward: { type: String, required: true },
  type: { type: String, required: true }, // Example: ICU, General, Private
  status: { type: String, required: true }, // Example: Available, Occupied, Under Maintenance
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  // Initially, patient is not assigned, so it's set to null.
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null }
});

module.exports = mongoose.model('Bed', BedSchema);
