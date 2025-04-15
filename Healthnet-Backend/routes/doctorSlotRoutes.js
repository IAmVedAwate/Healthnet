// routes/doctorSlotRoutes.js
const express = require('express');
const router = express.Router();
const {
  getDoctorSlots,
  addDoctorSlot,
  updateDoctorSlot,
  toggleDoctorSlotStatus,
  deleteDoctorSlot
} = require('../controllers/doctorSlotController');

// GET /doctor/slots – fetch all slots for a doctor (doctorId provided via query string)
router.get('/slots', getDoctorSlots);

// POST /doctor/slots – add a new slot
router.post('/slots', addDoctorSlot);

// PUT /doctor/slots/:id – update slot details
router.put('/slots/:id', updateDoctorSlot);

// PATCH /doctor/slots/:id/status – toggle active/inactive status of a slot
router.patch('/slots/:id/status', toggleDoctorSlotStatus);

// DELETE /doctor/slots/:id – remove a slot
router.delete('/slots/:id', deleteDoctorSlot);

module.exports = router;
