// roomController.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');
const db = require('../dbSetup');

// Promisify SQLite methods for async/await support.
const dbRun = promisify(db.run).bind(db);
const dbGet = promisify(db.get).bind(db);
const dbAll = promisify(db.all).bind(db);

/**
 * POST /rooms
 * Create a new room along with its beds.
 * Expected req.body: { hospitalId, roomName, roomType, description, bedCount }
 */
router.post('/', async (req, res) => {
    try {
        const { hospitalId, roomName, roomType, description, bedCount } = req.body;
        if (!hospitalId || !roomName || !roomType || bedCount === undefined) {
            return res.status(400).json({ msg: "Missing required fields" });
        }

        // Check if the hospital exists
        const hospital = await dbGet("SELECT * FROM Hospital WHERE hospitalId = ?", [hospitalId]);
        if (!hospital) {
            return res.status(400).json({ msg: "Invalid hospitalId. Hospital does not exist." });
        }

        const roomId = uuidv4();
        // Insert new room record.
        
        await dbRun(
            `INSERT INTO Room (roomId, hospitalId, roomName, roomType, availabilityStatus, description, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, 1, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [roomId, hospitalId, roomName, roomType, description]
);

// Create bed records based on bedCount.
        for (let i = 0; i < bedCount; i++) {
            const bedId = `${roomName}-BED-${i + 1}`;
            await dbRun(
                `INSERT INTO Bed (bedId, roomId, status, patientId, createdAt, updatedAt)
                 VALUES (?, ?, 'Unoccupied', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                [bedId, roomId]
            );
        }

return res.status(201).json({ msg: "Room created successfully", roomId });

} catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error", error: err.message });
}
});
// await dbRun(
//             `INSERT INTO Room (roomId, hospitalId, roomName, roomType, availabilityStatus, description, createdAt, updatedAt)
//          VALUES (?, ?, ?, ?, 1, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
//             [roomId, hospitalId, roomName, roomType, description]
//         );
//         // Create bed records based on bedCount.
//         for (let i = 0; i < bedCount; i++) {
//             const bedId = uuidv4();
//             await dbRun(
//                 `INSERT INTO Bed (bedId, roomId, status, patientId, createdAt, updatedAt)
//            VALUES (?, ?, 'Unoccupied', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
//                 [bedId, roomId]
//             );
//         }
//         return res.status(201).json({ msg: "Room created successfully", roomId });

/**
 * GET /rooms
 * Retrieve all rooms with a count of unoccupied beds.
 */
router.get('/', async (req, res) => {
    try {
        const rooms = await dbAll(`
      SELECT r.*, 
        (SELECT COUNT(*) FROM Bed b WHERE b.roomId = r.roomId AND b.status = 'Unoccupied') AS unoccupiedBeds
      FROM Room r
    `);
        return res.status(200).json(rooms);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error", error: err.message });
    }
});

/**
 * PUT /rooms/:roomId
 * Update room information and adjust bed count.
 * Expected req.body: { hospitalId, roomName, roomType, description, bedCount }
 */
router.put('/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;
        const { hospitalId, roomName, roomType, description, bedCount } = req.body;
        if (!roomId || !hospitalId || !roomName || !roomType || bedCount === undefined) {
            return res.status(400).json({ msg: "Missing required fields" });
        }
        // Update room info.
        await dbRun(
            `UPDATE Room 
       SET hospitalId = ?, roomName = ?, roomType = ?, description = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE roomId = ?`,
            [hospitalId, roomName, roomType, description, roomId]
        );
        // Get current total bed count for the room.
        const currentCountRow = await dbGet(`SELECT COUNT(*) as count FROM Bed WHERE roomId = ?`, [roomId]);
        const currentCount = currentCountRow.count;
        if (bedCount > currentCount) {
            // Add extra beds.
            const toAdd = bedCount - currentCount;
            for (let i = 0; i < toAdd; i++) {
                const bedId = uuidv4();
                await dbRun(
                    `INSERT INTO Bed (bedId, roomId, status, patientId, createdAt, updatedAt)
           VALUES (?, ?, 'Unoccupied', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                    [bedId, roomId]
                );
            }
        } else if (bedCount < currentCount) {
            // Delete the last added unoccupied beds.
            const toDelete = currentCount - bedCount;
            const bedsToDelete = await dbAll(
                `SELECT bedId FROM Bed 
         WHERE roomId = ? AND status = 'Unoccupied'
         ORDER BY createdAt DESC
         LIMIT ?`,
                [roomId, toDelete]
            );
            for (let bed of bedsToDelete) {
                await dbRun(`DELETE FROM Bed WHERE bedId = ?`, [bed.bedId]);
            }
        }
        return res.status(200).json({ msg: "Room updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error", error: err.message });
    }
});

/**
 * DELETE /rooms/:roomId
 * Delete the room and all associated beds.
 */
router.delete('/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;
        if (!roomId) {
            return res.status(400).json({ msg: "Missing roomId" });
        }
        // Delete all beds for this room.
        await dbRun(`DELETE FROM Bed WHERE roomId = ?`, [roomId]);
        // Delete the room.
        await dbRun(`DELETE FROM Room WHERE roomId = ?`, [roomId]);
        return res.status(200).json({ msg: "Room and associated beds deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error", error: err.message });
    }
});


/**
 * GET /rooms/:roomId/beds
 * Retrieve all bed records for a specific room.
 */
router.get('/:roomId/beds', async (req, res) => {
    try {
        const { roomId } = req.params;
        const beds = await dbAll(
  `SELECT b.*, p.name AS patientName
   FROM Bed b
   LEFT JOIN PatientData p ON b.patientId = p.patientDataId
   WHERE b.roomId = ?`,
  [roomId]
);


        return res.status(200).json(beds);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error", error: err.message });
    }
});

/**
 * PUT /rooms/beds/:bedId/assign
 * Assigns a patient to a specific bed.
 * Expects JSON body: { patientId: 'some-patient-id' }
 * Prevents the same patient from being assigned to more than one bed.
 */

router.put('/beds/:bedId/assign', async (req, res) => {
    try {
        const { bedId } = req.params;
        const { patientId } = req.body;

        if (!patientId) {
            return res.status(400).json({ msg: 'Missing patientId in request body' });
        }

        // Check if the patient is already assigned to any bed.
        const existingAssignment = await dbGet("SELECT * FROM Bed WHERE patientId = ?", [patientId]);
        if (existingAssignment) {
            return res.status(400).json({ msg: 'This patient is already assigned to a bed.' });
        }

        // Update the bed: assign the patient and mark as Occupied.
        await dbRun(
            `UPDATE Bed 
             SET patientId = ?, status = 'Occupied', updatedAt = CURRENT_TIMESTAMP 
             WHERE bedId = ?`,
            [patientId, bedId]
        );
        // Fetch patient's username using INNER JOIN
                const assignedPatient = await dbGet(
        `SELECT p.name 
        FROM Bed b
        LEFT JOIN PatientData p ON b.patientId = p.patientDataId
        WHERE b.bedId = ?`,
        [bedId]
        );


        if (!assignedPatient) {
            return res.status(404).json({ msg: 'Patient not found after assignment' });
        }

        return res.status(200).json({ 
            msg: 'Bed assigned successfully', 
            assignedPatient: assignedPatient.name 
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// router.put('/beds/:bedId/assign', async (req, res) => {
//     try {
//         const { bedId } = req.params;
//         const { patientId } = req.body;
//         if (!patientId) {
//             return res.status(400).json({ msg: 'Missing patientId in request body' });
//         }
//         // Check if the patient is already assigned to any bed.
//         const existingAssignment = await dbGet("SELECT * FROM Bed WHERE patientId = ?", [patientId]);
//         if (existingAssignment) {
//             return res.status(400).json({ msg: 'This patient is already assigned to a bed.' });
//         }
//         // Update the bed: assign the patient and mark as Occupied.
//         await dbRun(
//             `UPDATE Bed 
//          SET patientId = ?, status = 'Occupied', updatedAt = CURRENT_TIMESTAMP 
//          WHERE bedId = ?`,
//             [patientId, bedId]
//         );
//         return res.status(200).json({ msg: 'Bed assigned successfully' });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ msg: 'Server error', error: err.message });
//     }
// });

/**
 * PUT /rooms/beds/:bedId/discharge
 * Discharges a patient from a bed by setting the bed's patientId to NULL
 * and marking its status as Unoccupied.
 */
router.put('/beds/:bedId/discharge', async (req, res) => {
    try {
        const { bedId } = req.params;
        await dbRun(
            `UPDATE Bed 
         SET patientId = NULL, status = 'Unoccupied', updatedAt = CURRENT_TIMESTAMP 
         WHERE bedId = ?`,
            [bedId]
        );
        return res.status(200).json({ msg: 'Bed discharged successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;
