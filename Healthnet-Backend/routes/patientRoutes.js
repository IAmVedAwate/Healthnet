const express = require('express');
const {authenticate} = require('./auth');
const {
  addPatient,
  getAllPatients,
  getPatientById,
  deletePatient,
  updatePatient,
  getAllPatientsForBill,
  patientProfile,
  patientsAppointment
} = require('../controllers/patientController');

const router = express.Router();

router.post('/add', addPatient); // Add a new doctor
router.get('/byId/:id', getPatientById); // Fetch doctor by ID
router.get('/all', getAllPatients); // Fetch all doctors
router.get('/', getAllPatientsForBill); // Fetch all doctors
router.put('/:id', updatePatient); // Update doctor details
router.delete('/:id', deletePatient); // Remove a doctor by ID
router.get("/me/:id", patientProfile);
router.get("/myAppointment", patientsAppointment);

module.exports = router;