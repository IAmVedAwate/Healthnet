// controllers/queueController.js
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');
const db = require('../dbSetup');
// Import notifyQueueStatus from your socket helper if available.
const { notifyQueueStatus } = require('../socketHelper');

// Promisify SQLite methods.
const dbRun = promisify(db.run).bind(db);
const dbGet = promisify(db.get).bind(db);
const dbAll = promisify(db.all).bind(db);

/**
 * 1. Fetch All Queues for a given hospital.
 * GET /api/queues/:hospital
 */
const getAllQueues = async (req, res) => {
  try {
    const hospital = req.params.hospital;
    const queues = await dbAll(
      "SELECT * FROM Queue WHERE hospital = ? ORDER BY createdAt ASC",
      [hospital]
    );
    res.status(200).json(queues);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching queue data', error: err.message });
  }
};

/**
 * 2. Add a Patient to the Queue.
 * POST /api/queues
 * Expected body: { name, contactNo, message, patient, hospital, doctor, status }
 */
const addToQueue = async (req, res) => {
  try {
    const { userId, hospitalId, doctorId, appointmentDate, status, reason, notes } = req.body;
    if (!userId || !hospitalId || !doctorId || !appointmentDate || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const appointmentId = uuidv4();
    const insertQuery = `
      INSERT INTO Appointment 
        (appointmentId, patientId, hospitalId, doctorId, appointmentDate, status, reason, notes, createdAt, updatedAt)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    await dbRun(insertQuery, [
      appointmentId,
      userId,
      hospitalId,
      doctorId,
      appointmentDate,
      status,
      reason || "",
      notes || ""
    ]);
    const newAppointment = await dbGet("SELECT * FROM Appointment WHERE appointmentId = ?", [appointmentId]);
    if (notifyAppointmentStatus) {
      notifyAppointmentStatus(newAppointment);
    }
    res.status(201).json({ message: 'Appointment added successfully', newAppointment });
  } catch (err) {
    res.status(500).json({ message: 'Error adding appointment', error: err.message });
  }
};
/**
 * 3. Update Queue Status.
 * PUT /api/queues/:id
 * Expected body: { status }
 */
const updateQueueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updateQuery = `
      UPDATE Queue 
      SET status = ?, updatedAt = CURRENT_TIMESTAMP 
      WHERE queueId = ?
    `;
    await dbRun(updateQuery, [status, id]);
    const queue = await dbGet("SELECT * FROM Queue WHERE queueId = ?", [id]);
    if (!queue) {
      return res.status(404).json({ message: 'Queue entry not found' });
    }
    res.status(200).json({ message: 'Queue status updated successfully', queue });
  } catch (err) {
    res.status(500).json({ message: 'Error updating queue status', error: err.message });
  }
};

/**
 * 4. Remove a Patient from the Queue.
 * DELETE /api/queues/:id
 */
const deleteFromQueue = async (req, res) => {
  try {
    const { id } = req.params;
    const queue = await dbGet("SELECT * FROM Queue WHERE queueId = ?", [id]);
    if (!queue) {
      return res.status(404).json({ message: 'Queue entry not found' });
    }
    await dbRun("DELETE FROM Queue WHERE queueId = ?", [id]);
    res.status(200).json({ message: 'Patient removed from the queue', queue });
  } catch (err) {
    res.status(500).json({ message: 'Error removing from queue', error: err.message });
  }
};

/**
 * 5. Fetch Queue by Doctor.
 * GET /api/queues/doctor/:doctor
 */
const getQueueByDoctor = async (req, res) => {
  try {
    const { doctor } = req.params;
    const queue = await dbAll("SELECT * FROM Queue WHERE doctor = ? ORDER BY createdAt ASC", [doctor]);
    if (queue.length === 0) {
      return res.status(404).json({ message: 'No queue found for this doctor!' });
    }
    res.status(200).json(queue);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching queue by doctor!', error: err.message });
  }
};

/**
 * 6. Fetch Bed Availability.
 * GET /api/queues/bedAvailability/:hospital
 * Returns all beds for the hospital that are not occupied (i.e. patientId IS NULL).
 */
const fetchBedAvailability = async (req, res) => {
  try {
    const { hospital } = req.params;
    // Assuming the Bed table uses hospital column and patientId for assignment.
    const bedAvailability = await dbAll(
      "SELECT * FROM Bed WHERE hospital = ? AND patientId IS NULL",
      [hospital]
    );
    if (!bedAvailability) {
      return res.status(404).json({ message: 'No bed availability data found' });
    }
    res.status(200).json(bedAvailability);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bed availability', error: err.message });
  }
};

module.exports = {
  getAllQueues,
  addToQueue,
  updateQueueStatus,
  deleteFromQueue,
  getQueueByDoctor,
  fetchBedAvailability,
};
