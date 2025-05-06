// controllers/inventoryController.js

const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');
const db = require('../dbSetup');
const { error } = require('console');

// Promisify SQLite methods.
const dbRun = promisify(db.run).bind(db);
const dbGet = promisify(db.get).bind(db);
const dbAll = promisify(db.all).bind(db);

/**
 * 1. Fetch All Inventory Items for a hospital.
 *    Expects the hospital id in req.body.hospital.
 */
const getAllInventoryItems = async (req, res) => {
  try {
   
    const { hospital } = req.query;
    if (!hospital) {
      return res.status(400).json({ message: "hospitalid is required" });
    }
    const query = "SELECT * FROM Inventory WHERE hospitalId = ?";
    const inventory = await dbAll(query, [hospital]);
    res.status(200).json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching inventory items', error: err.message });
  }
};

/**
 * 2. Add a New Medicine.
 *    Expects: { name, quantity, expiryDate, hospital, imanager }
 *    Note: We map 'name' to itemName, 'expiryDate' to expiryDate.
 */
const addMedicine = async (req, res) => {
  try {
    const { name, quantity, expiryDate, hospital, itemType, supplier } = req.body;
    
    if (!name || !quantity || !expiryDate || !hospital ) {
      return res.status(400).json({ message: "name, quantity, expiryDate, hospital are required" });
    }

    
    

    const inventoryId = uuidv4();
    const query = `
      INSERT INTO Inventory 
        (inventoryId, hospitalId, itemName, itemType, quantity, supplier, expiryDate, createdAt, updatedAt)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    await dbRun(query, [
      inventoryId,
      hospital,
      name,
      itemType || null,
      quantity,
      supplier || null,
      expiryDate
    ]);
    
    
    // Fetch the newly created record.
    const newMedicine = await dbGet("SELECT * FROM Inventory WHERE inventoryId = ?", [inventoryId]);
    res.status(201).json(newMedicine);
  } catch (err) {
    res.status(500).json({ message: 'Error adding medicine', error: err.message });
  }
};

/**
 * 3. Remove a Medicine by inventoryId.
 *    Expects: { id } as a route parameter.
 */
const removeMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, check if the medicine exists.
    const existing = await dbGet("SELECT * FROM Inventory WHERE inventoryId = ?", [id]);
    if (!existing) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    const query = "DELETE FROM Inventory WHERE inventoryId = ?";
    await dbRun(query, [id]);
    res.status(200).json({ message: 'Medicine removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing medicine', error: err.message });
  }
};

/**
 * 4. Fetch a Specific Inventory Item by inventoryId.
 *    Expects: { id } as a route parameter.
 */
const getInventoryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM Inventory WHERE inventoryId = ?";
    const item = await dbGet(query, [id]);
    if (!item) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching medicine', error: err.message });
  }
};

/**
 * 5. Update Medicine Details.
 *    Expects: { name, quantity, expiryDate, itemType, supplier } in req.body.
 *    And inventoryId in req.params.id.
 */
const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, expiryDate, itemType, supplier } = req.body;
    
    // First, check if the medicine exists.
    const existing = await dbGet("SELECT * FROM Inventory WHERE inventoryId = ?", [id]);
    if (!existing) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    const query = `
      UPDATE Inventory
      SET itemName = COALESCE(?, itemName),
          quantity = COALESCE(?, quantity),
          expiryDate = COALESCE(?, expiryDate),
          itemType = COALESCE(?, itemType),
          supplier = COALESCE(?, supplier),
          updatedAt = CURRENT_TIMESTAMP
      WHERE inventoryId = ?
    `;
    await dbRun(query, [name, quantity, expiryDate, itemType, supplier, id]);
    
    const updatedItem = await dbGet("SELECT * FROM Inventory WHERE inventoryId = ?", [id]);
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: 'Error updating medicine', error: err.message });
  }
};

module.exports = {
  getAllInventoryItems,
  addMedicine,
  removeMedicine,
  getInventoryItemById,
  updateMedicine,
};
