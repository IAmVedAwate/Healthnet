const express = require('express');
const {authenticate} = require('./auth');
const {
  addDoctor,
  getDoctorById,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
  loginDoctorByPin,
  toggleDoctorStatus,
  submitUrgency
} = require('../controllers/doctorController');

const router = express.Router();

// // Define Routes
// router.post('/add',authenticate, addDoctor); // Add a new doctor
// router.get('/:id',authenticate, getDoctorById); // Fetch doctor by ID
// router.get('/',authenticate, getAllDoctors); // Fetch all doctors
// router.put('/:id',authenticate, updateDoctor); // Update doctor details
// router.delete('/:id',authenticate, deleteDoctor); // Remove a doctor by ID

router.post('/add', addDoctor); // Add a new doctor
router.get('/:id', getDoctorById); // Fetch doctor by ID
router.get('/all/:hospital', getAllDoctors); // Fetch all doctors
router.put('/:id', updateDoctor); // Update doctor details
router.delete('/:id', deleteDoctor); // Remove a doctor by ID
router.post('/auth', loginDoctorByPin);
router.patch('/:id/status', toggleDoctorStatus);
router.post('/urgency', submitUrgency);
module.exports = router;
