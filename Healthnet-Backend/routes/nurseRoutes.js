const express = require('express');
const {
  addNurse,
  getNurseById,
  getAllNurses,
  updateNurse,
  deleteNurse,
} = require('../controllers/nurseController');

const router = express.Router();

// Define Routes
router.post('/add', addNurse); // Add a new nurse
router.get('/:id', getNurseById); // Fetch nurse by ID
router.get('/', getAllNurses); // Fetch all nurses
router.put('/:id', updateNurse); // Update nurse details
router.delete('/:id', deleteNurse); // Remove a nurse by ID

module.exports = router;
