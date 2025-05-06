const express = require('express');
const { authenticate } = require('./auth');
const upload = require('../middlewares/upload');
const multer = require('multer');
const {
  addPatient,
  getAllPatients,
  getPatientById,
  deletePatient,
  updatePatient,
  getAllPatientsForBill,
  patientProfile,
  patientsAppointment,
  uploadMedicalHistory,
  getMedicalHistoryByPatient
} = require('../controllers/patientController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/history');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});



// POST route to upload medical history
router.post('/upload-history', upload.single('file'), uploadMedicalHistory);


router.post('/add', addPatient); // Add a new doctor
router.get('/byId/:id', getPatientById); // Fetch doctor by ID
router.get('/all', getAllPatients); // Fetch all doctors
router.get('/', getAllPatientsForBill); // Fetch all doctors
router.put('/:id', updatePatient); // Update doctor details
router.delete('/:id', deletePatient); // Remove a doctor by ID
router.get("/me/:id", patientProfile);
router.get("/myAppointment", patientsAppointment);

router.post("/upload-history", upload.single("file"), uploadMedicalHistory);
router.get('/patient-history', getMedicalHistoryByPatient);



module.exports = router;