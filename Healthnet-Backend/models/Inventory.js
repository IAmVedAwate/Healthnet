const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  expiryDate: { type: String, required: true },
});

const InventorySchema = new mongoose.Schema({
  inventoryID: { type: String, required: true },
  medicines: [MedicineSchema],
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
});

module.exports = mongoose.model('Inventory', InventorySchema);
