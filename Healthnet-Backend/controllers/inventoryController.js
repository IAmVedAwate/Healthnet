const Inventory = require('../models/Inventory');
const { v4: uuidv4 } = require('uuid'); 
// 1. Fetch All Inventory Items
const getAllInventoryItems = async (req, res) => {
  try {
    const inventory = await Inventory.find({hospital: req.body.hospital});
    res.status(200).json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching inventory items', error: err.message });
  }
};

// 2. Add a New Medicine
const addMedicine = async (req, res) => {
  try {
    const { name, quantity, expiryDate, hospital, patient } = req.body;
    const newMedicine = {
      name,
      quantity,
      expiryDate,
    };
    
    // Ensure that inventory exists, or create a new one
    let inventory = await Inventory.findOne({patient: patient});
    if (!inventory) {
      // If no inventory exists, create a new one
      inventory = new Inventory({
        inventoryID: `${uuidv4()}`,
        medicines: [newMedicine],
        hospital: hospital,
        patient: patient,
      });
      await inventory.save();
    } else {
      // Otherwise, update the existing inventory
      inventory = await Inventory.findOneAndUpdate(
        { patient: patient },
        { $push: { medicines: newMedicine } },
        { new: true, upsert: true }
      );
    }

    res.status(201).json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Error adding medicine', error: err.message });
  }
};

// 3. Remove a Medicine by ID
const removeMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const inventory = await Inventory.findOneAndUpdate(
      { "medicines._id": id },
      { $pull: { medicines: { _id: id } } },
      { new: true }
    );

    if (!inventory) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json({ message: 'Medicine removed successfully', inventory });
  } catch (err) {
    res.status(500).json({ message: 'Error removing medicine', error: err.message });
  }
};

// 4. Fetch a Specific Inventory Item by ID
const getInventoryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await Inventory.findOne({ 'medicines._id': id }, { 'medicines.$': 1 });

    if (!inventory) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json(inventory.medicines[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching medicine', error: err.message });
  }
};

// 5. Update Medicine Details
const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, expiryDate } = req.body;

    const inventory = await Inventory.findOneAndUpdate(
      { 'medicines._id': id },
      { $set: { 'medicines.$.name': name, 'medicines.$.quantity': quantity, 'medicines.$.expiryDate': expiryDate } },
      { new: true }
    );

    if (!inventory) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json(inventory);
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
