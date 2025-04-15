const express = require('express');
const {
  getAllQueues,
  addToQueue,
  updateQueueStatus,
  deleteFromQueue,
  getQueueByDoctor,
  fetchBedAvailability,
  // syncQueueToCityModule,
  // updateAdmissionStatus,
} = require('../controllers/queueController');

const router = express.Router();

// Define Routes
router.get('/:hospital', getAllQueues); // Fetch all queues
router.post('/add', addToQueue); // Add a patient to the queue
router.put('/:id', updateQueueStatus); // Update queue status
router.delete('/:id', deleteFromQueue); // Remove a patient from the queue
router.get('/doctor/:doctor', getQueueByDoctor); // Fetch queue by doctor
router.get('/beds/:hospital', fetchBedAvailability); // Fetch beds for a hospital
// router.post('/sync', syncQueueToCityModule); // Sync queue data to city module
// router.put('/admission-status', updateAdmissionStatus); // Update admission status


module.exports = router;
