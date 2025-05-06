const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');
const db = require('../dbSetup');

const dbRun = promisify(db.run).bind(db);
const dbGet = promisify(db.get).bind(db);
const dbAll = promisify(db.all).bind(db);

// Create a new inventory manager
const createIManager = async (req, res) => {
  try {
    const { hospitalId, firstName, lastName, email, password } = req.body;
    if (!hospitalId || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'hospitalId, firstName, lastName, email, and password are required' });
    }
    const imanagerId = uuidv4();
    const query = `
      INSERT INTO IManager (imanagerId, hospitalId, firstName, lastName, email, password, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    await dbRun(query, [imanagerId, hospitalId, firstName, lastName, email, password]);
    const newIManager = await dbGet('SELECT * FROM IManager WHERE imanagerId = ?', [imanagerId]);
    res.status(201).json(newIManager);
  } catch (err) {
    res.status(500).json({ message: 'Error creating inventory manager', error: err.message });
  }
};

// Get all inventory managers
const getAllIManagers = async (req, res) => {
  try {
    const imanagers = await dbAll('SELECT * FROM IManager');
    res.status(200).json(imanagers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching inventory managers', error: err.message });
  }
};

// Get inventory manager by ID
const getIManagerById = async (req, res) => {
  try {
    const { id } = req.params;
    const imanager = await dbGet('SELECT * FROM IManager WHERE imanagerId = ?', [id]);
    if (!imanager) {
      return res.status(404).json({ message: 'Inventory manager not found' });
    }
    res.status(200).json(imanager);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching inventory manager', error: err.message });
  }
};

// Update inventory manager details
const updateIManager = async (req, res) => {
  try {
    const { id } = req.params;
    const { hospitalId, firstName, lastName, email, password } = req.body;
    const existing = await dbGet('SELECT * FROM IManager WHERE imanagerId = ?', [id]);
    if (!existing) {
      return res.status(404).json({ message: 'Inventory manager not found' });
    }
    const query = `
      UPDATE IManager
      SET hospitalId = COALESCE(?, hospitalId),
          firstName = COALESCE(?, firstName),
          lastName = COALESCE(?, lastName),
          email = COALESCE(?, email),
          password = COALESCE(?, password),
          updatedAt = CURRENT_TIMESTAMP
      WHERE imanagerId = ?
    `;
    await dbRun(query, [hospitalId, firstName, lastName, email, password, id]);
    const updatedIManager = await dbGet('SELECT * FROM IManager WHERE imanagerId = ?', [id]);
    res.status(200).json(updatedIManager);
  } catch (err) {
    res.status(500).json({ message: 'Error updating inventory manager', error: err.message });
  }
};

// Delete inventory manager
const deleteIManager = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbGet('SELECT * FROM IManager WHERE imanagerId = ?', [id]);
    if (!existing) {
      return res.status(404).json({ message: 'Inventory manager not found' });
    }
    await dbRun('DELETE FROM IManager WHERE imanagerId = ?', [id]);
    res.status(200).json({ message: 'Inventory manager deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting inventory manager', error: err.message });
  }
};

module.exports = {
  createIManager,
  getAllIManagers,
  getIManagerById,
  updateIManager,
  deleteIManager,
};
