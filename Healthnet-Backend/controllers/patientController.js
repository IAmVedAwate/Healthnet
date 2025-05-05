// controllers/patientController.js
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');
const db = require('../dbSetup');
const path = require('path');


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
    const { hospitalId } = req.query;
    //console.log(hospitalId)
    const patients = await dbAll("SELECT * FROM PatientData WHERE hospitalId =? " ,[hospitalId]);
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

const patientsAppointment = async (req, res) => {
  try {
    const { id } = req.query;
    // console.log(id)

    const appointments = await dbAll(`
      SELECT 
        a.appointmentId,
        a.hospitalId,
        a.departmentId,
        a.doctorId,
        a.patientId,
        a.arrivalTime,
        a.cause,
        a.urgency,
        a.status,
        a.createdAt,
        d.firstName AS doctorFirstName,
        d.lastName AS doctorLastName,
        d.specialization,
        d.email AS doctorEmail,
        d.phoneNumber AS doctorPhone
      FROM Appointment a
      JOIN Doctor d ON a.doctorId = d.doctorId
      WHERE a.patientId = ?
    `, [id]);

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({ message: "No Appointments" });
    }

    // Format createdAt to date and day
    const formatted = appointments.map(app => ({
      ...app,
      appointmentDate: new Date(app.createdAt).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    res.status(500).json({ error: error.message });
  }
};

const uploadMedicalHistory = async (req, res) => {
  try {
    const { patientId } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const historyId = uuidv4();
    const fileName = file.filename;
    const filePath = path.join('uploads/history/', fileName);
    const fileType = file.mimetype;

    await dbRun(`
      INSERT INTO MedicalHistory (historyId, patientId, fileName, fileType, filePath)
      VALUES (?, ?, ?, ?, ?)
    `, [historyId, patientId, fileName, fileType, filePath]);

    res.status(200).json({ message: "Medical history uploaded successfully", filePath });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getMedicalHistoryByPatient = async (req, res) => {
  try {
    const { patientId } = req.query;

    const history = await dbAll(`
      SELECT fileName, fileType, filePath, uploadedAt 
      FROM MedicalHistory
      WHERE patientId = ?
      ORDER BY uploadedAt DESC
    `, [patientId]);

    res.status(200).json(history);
  } catch (error) {
    console.error("Fetch history error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
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
};
