const mongoose = require('mongoose');

const QueueSchema = new mongoose.Schema(
  {
    name:{ type: String, required: true, required: true }, 
    contactNo:{ type: String, required: true, required: true }, 
    message:{ type: String, required: true, default: null },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
    status: { type: String, required: true, default: 'Waiting' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Queue', QueueSchema);
