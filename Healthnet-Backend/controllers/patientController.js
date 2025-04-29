// controllers/patientController.js
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');
const db = require('../dbSetup');

const dbRun = promisify(db.run).bind(db);
const dbGet = promisify(db.get).bind(db);
const dbAll = promisify(db.all).bind(db);

// POST /api/patients
const addPatient = async (req, res) => {
  try {
    const {
      hospitalId,
      name,
      age,
      gender,
      doctorId,
      contactInfo,
      status
    } = req.body;

    const patientDataId = uuidv4();

    const query = `
      INSERT INTO PatientData 
        (patientDataId, hospitalId, name, age, gender, doctorId, contactInfo, status, createdAt, updatedAt)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    await dbRun(query, [
      patientDataId,
      hospitalId,
      name,
      age,
      gender,
      doctorId,
      contactInfo,
      status
    ]);

    const newPatient = await dbGet("SELECT * FROM PatientData WHERE patientDataId = ?", [patientDataId]);
    res.status(201).json(newPatient);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
};

const getAllPatientsForBill = async (req, res) => {
  try {
    const patients = await dbAll("SELECT * FROM PatientData;");
    res.status(200).json(patients);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await dbAll("SELECT * FROM PatientData");
    res.status(200).json(patients);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/patients/:id
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await dbGet("SELECT * FROM PatientData WHERE patientDataId = ?", [id]);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/patients/:id
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbRun("DELETE FROM PatientData WHERE patientDataId = ?", [id]);

    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/patients/:id
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      hospitalId,
      name,
      age,
      gender,
      doctorId,
      contactInfo,
      status
    } = req.body;

    const query = `
      UPDATE PatientData 
      SET hospitalId = ?, name = ?, age = ?, gender = ?, doctorId = ?, contactInfo = ?, status = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE patientDataId = ?
    `;

    await dbRun(query, [
      hospitalId,
      name,
      age,
      gender,
      doctorId,
      contactInfo,
      status,
      id
    ]);

    const updatedPatient = await dbGet("SELECT * FROM PatientData WHERE patientDataId = ?", [id]);
    res.status(200).json(updatedPatient);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};


const patientProfile = async (req,res) => {
  try {
    const { id } = req.params;
    const patient = await dbGet("SELECT * FROM Patient WHERE patientId = ?", [id]);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  addPatient,
  getAllPatients,
  getPatientById,
  deletePatient,
  updatePatient,
  getAllPatientsForBill,
  patientProfile
};
