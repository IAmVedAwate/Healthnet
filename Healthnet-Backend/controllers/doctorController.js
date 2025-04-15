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
 * Expects doctor's details in req.body including authPin.
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
      authPin  // new field required for doctor authentication pin
    } = req.body;

    if (!authPin) {
      return res.status(400).json({ message: 'authPin is required' });
    }

    const doctorId = uuidv4();

    const query = `
      INSERT INTO Doctor 
        (doctorId, hospitalId, departmentId, firstName, lastName, email, phoneNumber, specialization, qualification, experience, authPin, createdAt, updatedAt)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
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
      authPin
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
 * Expects updated fields in req.body; can include authPin and isActive.
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
      authPin,   // new field for updating doctor's authentication pin
      isActive   // new field for updating availability status (optional)
    } = req.body;

    // Build the update query. We assume authPin is required for update as well.
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
          authPin = ?,
          isActive = COALESCE(?, isActive),
          updatedAt = CURRENT_TIMESTAMP
      WHERE doctorId = ?
    `;
    await dbRun(updateQuery, [
      hospitalId,
      departmentId,
      firstName,
      lastName,
      email,
      phoneNumber,
      specialization,
      qualification,
      experience,
      authPin,
      isActive,   // if not provided, COALESCE will leave the current value intact
      id,
    ]);

    // Check if any row was updated by fetching the doctor record again.
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

const loginDoctorByPin = async (req, res) => {
  try {
    const { doctorid, pin } = req.body;

    if (!doctorid || !pin) {
      return res.status(400).json({ message: "Doctor ID and PIN are required." });
    }

    // Retrieve the doctor record by doctorId.
    const doctor = await dbGet("SELECT * FROM Doctor WHERE doctorId = ?", [doctorid]);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // Compare the provided PIN.
    if (doctor.authPin !== pin) {
      return res.status(401).json({ message: "Invalid PIN." });
    }

    // Successful authentication; return doctor details.
    res.status(200).json({ message: "Doctor authenticated.", doctor, verified: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const toggleDoctorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    // Retrieve current slot.
    const slot = await dbGet("SELECT * FROM Doctor WHERE doctorId = ?", [id]);
    if (!slot) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    // Toggle status: if 1 then 0, if 0 then 1.
    const newStatus = slot.isActive === 1 ? 0 : 1;
    const updateQuery = `
      UPDATE Doctor
      SET isActive = ?
      WHERE doctorId = ?
    `;
    await dbRun(updateQuery, [newStatus, id]);
    const updatedSlot = await dbGet("SELECT * FROM Doctor WHERE doctorId = ?", [id]);
    res.status(200).json(updatedSlot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  addDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
  loginDoctorByPin,
  toggleDoctorStatus
};
