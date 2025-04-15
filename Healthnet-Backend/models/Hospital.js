const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  hospitalLocation: { type: String, required: true },
  hospitalContactInfo: { type: String, required: true },
});

module.exports = mongoose.model('Hospital', hospitalSchema);
