const express = require('express');
const {
  createIManager,
  getAllIManagers,
  getIManagerById,
  updateIManager,
  deleteIManager,
} = require('../controllers/imanagerController');

const router = express.Router();

router.post('/', createIManager);
router.get('/', getAllIManagers);
router.get('/:id', getIManagerById);
router.put('/:id', updateIManager);
router.delete('/:id', deleteIManager);

module.exports = router;
