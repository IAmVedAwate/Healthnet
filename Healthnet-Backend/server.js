// server.js
require('dotenv').config();
const express = require('express');
const path = require('path')
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');

// Import the SQLite DB instance from dbSetup.js
const db = require('./dbSetup');

// Promisify SQLite methods for async/await
const dbGet = promisify(db.get).bind(db);
const dbRun = promisify(db.run).bind(db);

/**
 * Create a default Admin if one doesn't exist.
 * The admin details are provided in the .env file.
 */
async function createDefaultAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';

    if (!adminEmail || !adminPassword) {
      console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
      return;
    }

    // Check if an admin already exists with this email.
    const existingAdmin = await dbGet("SELECT * FROM Admin WHERE email = ?", [adminEmail]);
    if (existingAdmin) {
      console.log("Default admin already exists.");
      return;
    }

    // Hash the admin password and insert new admin.
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(adminPassword, salt);
    const adminId = uuidv4();
    await dbRun(
      `INSERT INTO Admin (adminId, username, email, password, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [adminId, adminUsername, adminEmail, hash]
    );

    console.log("Default admin created successfully.");
  } catch (err) {
    console.error("Error creating default admin:", err.message);
  }
}

// Call the function to create default admin at startup.
createDefaultAdmin();

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());


const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const roomController = require('./controllers/roomController');
app.use('/api/rooms', roomController);

const patientRoutes = require('./routes/patientRoutes');
app.use('/api/patients', patientRoutes);

const hospitalRoutes = require('./routes/hospitalRoutes');
app.use('/api/hospitals', hospitalRoutes);

const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api/doctors', doctorRoutes);

const doctorSlotRoutes = require('./routes/doctorSlotRoutes');
app.use('/api/doctor', doctorSlotRoutes);

const queueRoutes = require('./routes/queueRoutes');
app.use('/api/queues', queueRoutes);


app.use('/uploads/history', express.static(path.join(__dirname, 'uploads/history')))

const inventoryRoutes = require('./routes/inventoryRoutes');
app.use('/api/inventory' , inventoryRoutes)

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => console.log('A user disconnected'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { server, io };
