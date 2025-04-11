// controllers/doctorController.js
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');
const db = require('../dbSetup');

// Promisify SQLite methods for async/await support.
const dbRun = promisify(db.run).bind(db);
const dbGet = promisify(db.get).bind(db);
const dbAll = promisify(db.all).bind(db);

/**
 * POST /api/doctors
 * Adds a new doctor record.
 * Expects doctor's details in req.body.
 */
const addDoctor = async (req, res) => {
  try {
    const {
      hospitalId,
      departmentId,
      firstName,
      lastName,
      email,
      phoneNumber,
      specialization,
      qualification,
      experience,
    } = req.body;

    const doctorId = uuidv4();

    const query = `
      INSERT INTO Doctor 
        (doctorId, hospitalId, departmentId, firstName, lastName, email, phoneNumber, specialization, qualification, experience, createdAt, updatedAt)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    await dbRun(query, [
      doctorId,
      hospitalId,
      departmentId,
      firstName,
      lastName,
      email,
      phoneNumber,
      specialization,
      qualification,
      experience,
    ]);

    // Return the created doctor object.
    const newDoctor = await dbGet("SELECT * FROM Doctor WHERE doctorId = ?", [doctorId]);
    res.status(201).json(newDoctor);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * GET /api/doctors/:id
 * Retrieves a doctor by doctorId.
 */
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await dbGet("SELECT * FROM Doctor WHERE doctorId = ?", [id]);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * PUT /api/doctors/:id
 * Updates an existing doctor record.
 * Expects updated fields in req.body.
 */
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      hospitalId,
      departmentId,
      firstName,
      lastName,
      email,
      phoneNumber,
      specialization,
      qualification,
      experience,
    } = req.body;

    const updateQuery = `
      UPDATE Doctor
      SET hospitalId = ?,
          departmentId = ?,
          firstName = ?,
          lastName = ?,
          email = ?,
          phoneNumber = ?,
          specialization = ?,
          qualification = ?,
          experience = ?,
          updatedAt = CURRENT_TIMESTAMP
      WHERE doctorId = ?
    `;
    const result = await dbRun(updateQuery, [
      hospitalId,
      departmentId,
      firstName,
      lastName,
      email,
      phoneNumber,
      specialization,
      qualification,
      experience,
      id,
    ]);

    // Check if any row was updated. (dbRun doesn't return affectedRows reliably in SQLite,
    // so we'll do a subsequent fetch.)
    const doctor = await dbGet("SELECT * FROM Doctor WHERE doctorId = ?", [id]);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * DELETE /api/doctors/:id
 * Deletes a doctor record by doctorId.
 */
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if doctor exists
    const doctor = await dbGet("SELECT * FROM Doctor WHERE doctorId = ?", [id]);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    await dbRun("DELETE FROM Doctor WHERE doctorId = ?", [id]);
    res.status(200).json({ message: 'Doctor deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * GET /api/doctors/hospital/:hospital
 * Retrieves all doctors for a specific hospital.
 */
const getAllDoctors = async (req, res) => {
  try {
    const { hospital } = req.params;
    const doctors = await dbAll("SELECT * FROM Doctor WHERE hospitalId = ?", [hospital]);
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctors', error: err.message });
  }
};

module.exports = {
  addDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
};
