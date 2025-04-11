// controllers/patientController.js
const Patient = require('../models/Patient');
const Bed = require('../models/Bed');

const createPatient = async (req, res) => {
  try {
    
    const newPatient = new Patient(req.body);

    await newPatient.save();
    res.status(201).send(newPatient);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const addPatient = async (req, res) => {
  try {
    const { bed } = req.body;
    const bedUpdate = await Bed.findOneAndUpdate(
          { _id: bed._id },
          { ward: bed.ward, type: bed.type, status: bed.status, patient: req.params.id },
          { new: true }
        );

    await bedUpdate.save();
    res.status(201).send(bedUpdate);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id });
    
    if (!patient) {
      return res.status(404).send({ message: 'Patient not found' });
    }
    
    res.status(200).send(patient);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({hospital: req.body.hospital});
    res.status(200).send(patients);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    if (!patient) {
      return res.status(404).send({ message: 'Patient not found' });
    }

    res.status(200).send(patient);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({ _id: req.params.id });

    if (!patient) {
      return res.status(404).send({ message: 'Patient not found' });
    }

    res.status(200).send({ message: 'Patient deleted' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};



module.exports = {
  createPatient,
  addPatient,
  getAllPatients,
  getPatientById,
  deletePatient,
  updatePatient,
};