// controllers/doctorSlotController.js
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');
const db = require('../dbSetup');

// Promisify SQLite methods.
const dbRun = promisify(db.run).bind(db);
const dbGet = promisify(db.get).bind(db);
const dbAll = promisify(db.all).bind(db);

/**
 * GET /doctor/slots?doctorId=<doctorId>
 * Fetch all slots for a doctor.
 */
const getDoctorSlots = async (req, res) => {
  try {
    const { doctorid } = req.query;
    if (!doctorid) {
      return res.status(400).json({ message: "doctorId is required" });
    }
    const slots = await dbAll("SELECT * FROM DoctorSlot WHERE doctorId = ?", [doctorid]);
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /doctor/slots
 * Adds a new slot.
 * Expects: { doctorId, slotDate, slotTime, [isActive] }
 */
const addDoctorSlot = async (req, res) => {
    try {
      const { doctorId, startTime, endTime, isActive } = req.body;
      if (!doctorId || !startTime || !endTime) {
        return res.status(400).json({ message: "doctorId, startTime, and endTime are required." });
      }
  
      // Check for overlapping slots
      const overlapQuery = `
        SELECT * FROM DoctorSlot 
        WHERE doctorId = ? 
          AND NOT (endTime <= ? OR startTime >= ?)
      `;
      const overlapping = await dbAll(overlapQuery, [doctorId, startTime, endTime]);
  
      if (overlapping.length > 0) {
        return res.status(400).json({ message: "Slot overlaps with existing slot." });
      }
  
      const slotId = uuidv4();
      const query = `
        INSERT INTO DoctorSlot 
        (slotId, doctorId, startTime, endTime, isActive)
        VALUES (?, ?, ?, ?, ?)
      `;
      await dbRun(query, [slotId, doctorId, startTime, endTime, isActive ?? 1]);
      const newSlot = await dbGet("SELECT * FROM DoctorSlot WHERE slotId = ?", [slotId]);
      res.status(201).json(newSlot);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
/**
 * PUT /doctor/slots/:id
 * Updates an existing slot.
 * Expects: { slotDate, slotTime, [isActive] }
 */
const updateDoctorSlot = async (req, res) => {
    try {
      const { id } = req.params;
      const { startTime, endTime, isActive } = req.body;
  
      const existingSlot = await dbGet("SELECT * FROM DoctorSlot WHERE slotId = ?", [id]);
      if (!existingSlot) {
        return res.status(404).json({ message: "Slot not found" });
      }
  
      // Use fallback values if not provided
      const newStart = startTime || existingSlot.startTime;
      const newEnd = endTime || existingSlot.endTime;
  
      // Check for overlapping with other slots (exclude current)
      const overlapQuery = `
        SELECT * FROM DoctorSlot 
        WHERE doctorId = ? 
          AND slotId != ?
          AND NOT (endTime <= ? OR startTime >= ?)
      `;
      const overlapping = await dbAll(overlapQuery, [existingSlot.doctorId, id, newStart, newEnd]);
  
      if (overlapping.length > 0) {
        return res.status(400).json({ message: "Updated slot overlaps with another existing slot." });
      }
  
      const updateQuery = `
        UPDATE DoctorSlot
        SET startTime = COALESCE(?, startTime),
            endTime = COALESCE(?, endTime),
            isActive = COALESCE(?, isActive)
        WHERE slotId = ?
      `;
      await dbRun(updateQuery, [startTime, endTime, isActive, id]);
  
      const updated = await dbGet("SELECT * FROM DoctorSlot WHERE slotId = ?", [id]);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

/**
 * PATCH /doctor/slots/:id/status
 * Toggles the slot's active status.
 */
const toggleDoctorSlotStatus = async (req, res) => {
  try {
    const { id } = req.params;
    // Retrieve current slot.
    const slot = await dbGet("SELECT * FROM DoctorSlot WHERE slotId = ?", [id]);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    // Toggle status: if 1 then 0, if 0 then 1.
    const newStatus = slot.isActive === 1 ? 0 : 1;
    const updateQuery = `
      UPDATE DoctorSlot
      SET isActive = ?
      WHERE slotId = ?
    `;
    await dbRun(updateQuery, [newStatus, id]);
    const updatedSlot = await dbGet("SELECT * FROM DoctorSlot WHERE slotId = ?", [id]);
    res.status(200).json(updatedSlot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE /doctor/slots/:id
 * Deletes a slot by slotId.
 */
const deleteDoctorSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const slot = await dbGet("SELECT * FROM DoctorSlot WHERE slotId = ?", [id]);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    await dbRun("DELETE FROM DoctorSlot WHERE slotId = ?", [id]);
    res.status(200).json({ message: "Slot deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDoctorSlots,
  addDoctorSlot,
  updateDoctorSlot,
  toggleDoctorSlotStatus,
  deleteDoctorSlot,
};
