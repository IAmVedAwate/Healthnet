const express = require('express');
const {authenticate} = require('./auth');
const { 
  getAllHospitals, 
  getHospitalById,
  getDepartmentsByHospital, 
} = require('../controllers/hospitalController');

const router = express.Router();

// // Define Routes
// router.get('/',authenticate, getAllHospitals); // Fetch all hospitals
// router.get('/:id',authenticate, getHospitalById); // Fetch a specific hospital by ID

router.get('/', getAllHospitals); // Fetch all hospitals
router.get('/:id', getHospitalById); // Fetch a specific hospital by ID
router.get('/hospital/:hospitalId', getDepartmentsByHospital);

module.exports = router;
