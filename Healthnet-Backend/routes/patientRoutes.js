// routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const { promisify } = require('util');
const db = require('../dbSetup');

// Promisify the SQLite db.all method for async/await support.
const dbAll = promisify(db.all).bind(db);

/**
 * GET /api/patients
 * Retrieves all patients from the database.
 */
/**
 * GET /api/patients
 * Retrieves all patients that are not assigned to any bed (in the entire hospital)
 */
router.get('/', async (req, res) => {
  try {
    const patients = await dbAll(`
      SELECT patientId, username, email, phoneNumber, address, createdAt 
      FROM Patient
      WHERE patientId NOT IN (SELECT patientId FROM Bed WHERE patientId IS NOT NULL)
    `);
    return res.status(200).json(patients);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;