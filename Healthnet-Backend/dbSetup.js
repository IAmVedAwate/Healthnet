// dbSetup.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'HealthNet.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error("Error connecting to SQLite database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
    createTables();
  }
});

function createTables() {
  db.serialize(() => {
    // Enable foreign keys support
    db.run("PRAGMA foreign_keys = ON;", (err) => {
      if (err) console.error("Error enabling foreign keys:", err.message);
    });

    // Admin table: created by code (no signup)
    db.run(`
      CREATE TABLE IF NOT EXISTS Admin (
        adminId TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `, (err) => { if (err) console.error("Error creating Admin table:", err.message); });

    db.run(`
      CREATE TABLE IF NOT EXISTS SignupRequest (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        location TEXT NOT NULL,
        contact TEXT NOT NULL,
        password TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `, (err) => {
      if (err) console.error("Error creating SignupRequest table:", err.message);
    });

    // Hospital table: created by Admin (separate signup & JWT)
    db.run(`
      CREATE TABLE IF NOT EXISTS Hospital (
        hospitalId TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phoneNumber TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `, (err) => { if (err) console.error("Error creating Hospital table:", err.message); });

    // Patient table: Patient can signup
    db.run(`
      CREATE TABLE IF NOT EXISTS Patient (
        patientId TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phoneNumber TEXT,
        address TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `, (err) => { if (err) console.error("Error creating Patient table:", err.message); });
    // PatientData table: Patient data
    db.run(`
      CREATE TABLE IF NOT EXISTS PatientData (
        patientDataId TEXT PRIMARY KEY,
        hospitalId TEXT NOT NULL,
        name TEXT NOT NULL,
        age INTEGER,
        gender TEXT,
        doctorId TEXT NOT NULL,
        contactInfo TEXT,
        status TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctorId) REFERENCES Doctor(doctorId),
        FOREIGN KEY (hospitalId) REFERENCES Hospital(hospitalId)
      );
  `, (err) => {
  if (err) console.error("Error creating PatientData table:", err.message);
});


    // IManager table: Inventory Manager, belongs to a Hospital
    db.run(`
      CREATE TABLE IF NOT EXISTS IManager (
        imanagerId TEXT PRIMARY KEY,
        hospitalId TEXT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hospitalId) REFERENCES Hospital(hospitalId)
      );
    `, (err) => { if (err) console.error("Error creating IManager table:", err.message); });

    // Department table: belongs to a Hospital
    db.run(`
      CREATE TABLE IF NOT EXISTS Department (
        departmentId TEXT PRIMARY KEY,
        hospitalId TEXT,
        name TEXT NOT NULL,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hospitalId) REFERENCES Hospital(hospitalId)
      );
    `, (err) => { if (err) console.error("Error creating Department table:", err.message); });

    // Doctor table: belongs to Hospital and Department
    db.run(`
      CREATE TABLE IF NOT EXISTS Doctor (
        doctorId TEXT PRIMARY KEY,
        hospitalId TEXT,
        departmentId TEXT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phoneNumber TEXT,
        specialization TEXT,
        qualification TEXT,
        experience INTEGER,
        authPin TEXT NOT NULL, -- new field for authentication pin
        isActive INTEGER DEFAULT 1, -- 1 for active, 0 for inactive
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hospitalId) REFERENCES Hospital(hospitalId),
        FOREIGN KEY (departmentId) REFERENCES Department(departmentId)
      );
    `, (err) => { if (err) console.error("Error creating Doctor table:", err.message); });

      // Create DoctorSlot table
db.run(`
  CREATE TABLE IF NOT EXISTS DoctorSlot (
    slotId TEXT PRIMARY KEY,
    doctorId TEXT NOT NULL,
    startTime TEXT NOT NULL,
    endTime TEXT NOT NULL,
    isActive INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (doctorId) REFERENCES Doctor(doctorId)
  )
`, (err) => { if (err) console.error("Error creating Doctor Slot table:", err.message); });

    // Appointment table: Hospital-Department-Doctor-Appointments
    db.run(`
      CREATE TABLE IF NOT EXISTS Appointment (
        appointmentId TEXT PRIMARY KEY,
        hospitalId TEXT,
        doctorId TEXT,
        patientId TEXT,
        appointmentDate DATETIME,
        status TEXT,
        reason TEXT,
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hospitalId) REFERENCES Hospital(hospitalId),
        FOREIGN KEY (doctorId) REFERENCES Doctor(doctorId),
        FOREIGN KEY (patientId) REFERENCES Patient(patientId)
      );
    `, (err) => { if (err) console.error("Error creating Appointment table:", err.message); });

    // Room table: belongs to Hospital
    db.run(`
      CREATE TABLE IF NOT EXISTS Room (
      roomId TEXT PRIMARY KEY,
      hospitalId TEXT,
      roomName TEXT,
      roomType TEXT,
      availabilityStatus INTEGER DEFAULT 1,
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hospitalId) REFERENCES Hospital(hospitalId)
    );
    `, (err) => { if (err) console.error("Error creating Room table:", err.message); });

    // Bed table: belongs to Room; may have a Patient (nullable)
    db.run(`
      CREATE TABLE IF NOT EXISTS Bed (
        bedId TEXT PRIMARY KEY,
        roomId TEXT,
        patientId TEXT, -- can be NULL if no patient assigned
        status TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (roomId) REFERENCES Room(roomId),
        FOREIGN KEY (patientId) REFERENCES Patient(patientId)
      );
    `, (err) => { if (err) console.error("Error creating Bed table:", err.message); });

    // Inventory table: Hospital-IManager-Inventory
    db.run(`
      CREATE TABLE IF NOT EXISTS Inventory (
        inventoryId TEXT PRIMARY KEY,
        hospitalId TEXT,
        itemName TEXT NOT NULL,
        itemType TEXT,
        quantity INTEGER DEFAULT 0,
        supplier TEXT,
        receivedDate DATE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hospitalId) REFERENCES Hospital(hospitalId),
      );
    `, (err) => { if (err) console.error("Error creating Inventory table:", err.message); });

    // MedicalRecord table:
    // Can be seen by Doctor, IManager, Hospital and Patient but created/updated by Doctor and IManager.
    // Linked to Appointment and Patient; created by either Doctor or IManager.
    db.run(`
      CREATE TABLE IF NOT EXISTS MedicalRecord (
        recordId TEXT PRIMARY KEY,
        appointmentId TEXT,
        patientId TEXT,
        doctorId TEXT,   -- nullable if created by IManager
        imanagerId TEXT, -- nullable if created by Doctor
        diagnosis TEXT,
        prescription TEXT,
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointmentId) REFERENCES Appointment(appointmentId),
        FOREIGN KEY (patientId) REFERENCES Patient(patientId),
        FOREIGN KEY (doctorId) REFERENCES Doctor(doctorId),
        FOREIGN KEY (imanagerId) REFERENCES IManager(imanagerId)
      );
    `, (err) => { if (err) console.error("Error creating MedicalRecord table:", err.message); });

    console.log("All tables have been created (if they did not already exist).");
  });
}

module.exports = db;