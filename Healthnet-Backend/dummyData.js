const { v4: uuidv4 } = require('uuid');
const db = require('./dbSetup');
const { promisify } = require('util');

const dbRun = promisify(db.run).bind(db);

async function insertDummyHospital() {
  const hospitalId = 'hospital123';
  const name = 'Dummy Hospital';
  const address = '123 Main St';
  const email = 'dummyhospital@example.com';
  const password = 'password'; // In real case, hash it
  const phoneNumber = '1234567890';

  try {
    await dbRun(
      `INSERT OR IGNORE INTO Hospital (hospitalId, name, address, email, password, phoneNumber, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [hospitalId, name, address, email, password, phoneNumber]
    );
    console.log('Dummy hospital inserted or already exists.');
  } catch (err) {
    console.error('Error inserting dummy hospital:', err.message);
  }
}

async function insertDummyIManager() {
  const imanagerId = 'imanager123';
  const hospitalId = 'hospital123';
  const firstName = 'John';
  const lastName = 'Doe';
  const email = 'john.doe@example.com';
  const password = 'password'; // In real case, hash it

  try {
    await dbRun(
      `INSERT OR IGNORE INTO IManager (imanagerId, hospitalId, firstName, lastName, email, password, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [imanagerId, hospitalId, firstName, lastName, email, password]
    );
    console.log('Dummy inventory manager inserted or already exists.');
  } catch (err) {
    console.error('Error inserting dummy inventory manager:', err.message);
  }
}

async function insertDummyData() {
  await insertDummyHospital();
  await insertDummyIManager();
  process.exit(0);
}

insertDummyData();
