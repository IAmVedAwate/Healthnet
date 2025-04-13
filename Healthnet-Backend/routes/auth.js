// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Import SQLite db instance from your dbSetup module
const db = require('../dbSetup');

// Promisify SQLite methods for async/await
const { promisify } = require('util');
const dbGet = promisify(db.get).bind(db);
const dbRun = promisify(db.run).bind(db);

// Extra API Functions for Reset Password and Forget Password

const nodemailer = require('nodemailer');

// Set up the email transporter using SMTP details from environment variables.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: process.env.EMAIL_PORT || 465,
  secure: process.env.EMAIL_SECURE === 'true', // true for port 465, false for others
  auth: {
    user: process.env.EMAIL_USER || 'your-email@example.com',
    pass: process.env.EMAIL_PASS || 'your-email-password',
  },
});

/**
 * Reset Password Endpoint
 * POST /api/auth/reset-password
 * Expects: { email, previousPassword, newPassword }
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { email, previousPassword, newPassword } = req.body;
    if (!email || !previousPassword || !newPassword) {
      return res.status(400).json({ msg: "Please provide email, previous password, and new password" });
    }

    // Find the user in Admin, Hospital, or Patient table using proper field names
    let user = await dbGet("SELECT * FROM Admin WHERE email = ?", [email]);
    let table = 'Admin', idField = 'adminId';
    if (!user) {
      user = await dbGet("SELECT * FROM Hospital WHERE email = ?", [email]);
      table = 'Hospital';
      idField = 'hospitalId';
    }
    if (!user) {
      user = await dbGet("SELECT * FROM Patient WHERE email = ?", [email]);
      table = 'Patient';
      idField = 'patientId';
    }
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Verify the previous password using bcrypt comparison
    const isMatch = bcrypt.compareSync(previousPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Previous password is incorrect" });
    }

    // Hash the new password
    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword, salt);

    // Update the user's password in the proper table (also update the updatedAt field)
    await dbRun(
      `UPDATE ${table} SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE ${idField} = ?`,
      [newHash, user[idField]]
    );

    res.json({ success: true, msg: "Password updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * Forget Password Endpoint
 * POST /api/auth/forget-password
 * Expects: { email }
 * Generates a temporary password, updates the user's password in the database,
 * and sends an email with the temporary password.
 */
router.post('/forget-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: "Please provide email" });
    }

    // Find the user in Admin, Hospital, or Patient table using proper field names
    let user = await dbGet("SELECT * FROM Admin WHERE email = ?", [email]);
    let table = 'Admin', idField = 'adminId';
    if (!user) {
      user = await dbGet("SELECT * FROM Hospital WHERE email = ?", [email]);
      table = 'Hospital';
      idField = 'hospitalId';
    }
    if (!user) {
      user = await dbGet("SELECT * FROM Patient WHERE email = ?", [email]);
      table = 'Patient';
      idField = 'patientId';
    }
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Generate a temporary password (using the first segment of a UUID)
    const tempPassword = uuidv4().split('-')[0];
    const salt = bcrypt.genSaltSync(10);
    const tempHash = bcrypt.hashSync(tempPassword, salt);

    // Update the user's password in the corresponding table
    await dbRun(
      `UPDATE ${table} SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE ${idField} = ?`,
      [tempHash, user[idField]]
    );

    // Prepare the email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@example.com',
      to: email,
      subject: 'Password Reset Request',
      text: `Your password has been reset. Your new temporary password is: ${tempPassword}`
    };

    // Send the email using the transporter
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.json({success: true,tempPassword: tempPassword, msg: `Failed to send email But Your password has been reset. Your new temporary password is: ${tempPassword}` });
      } else {
        console.log("Email sent:", info.response);
        res.json({ success: true, msg: "A temporary password has been sent to your email." });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


/**
 * Patient Signup
 * Endpoint: POST /api/auth/patient/signup
 */
router.post('/patient/signup', async (req, res) => {
  try {
    const { username, email, password, confirmPassword, phoneNumber, address } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    // Check email uniqueness across Patient and Hospital tables
    const patientExists = await dbGet("SELECT * FROM Patient WHERE email = ?", [email]);
    const hospitalExists = await dbGet("SELECT * FROM Hospital WHERE email = ?", [email]);
    if (patientExists || hospitalExists) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const patientId = uuidv4();

    await dbRun(`
      INSERT INTO Patient (patientId, username, email, password, phoneNumber, address, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [patientId, username, email, hash, phoneNumber, address]);

    const payload = { id: patientId, email, role: "Patient" };
    jwt.sign(payload, process.env.TOKEN, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.setHeader('access-token', token);
      res.json({
        token,
        role: "Patient",
        id: patientId,
        success: true,
        msg: "Patient signup successful!"
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// routes/auth.js (or wherever your hospital signup endpoint is defined)
router.post('/hospital/signup', async (req, res) => {
    try {
      const { name, email, password, confirmPassword, address, phoneNumber } = req.body;
      if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Passwords do not match" });
      }
  
      // Check email uniqueness across Hospital and Patient tables
      const hospitalExists = await dbGet("SELECT * FROM Hospital WHERE email = ?", [email]);
      const patientExists = await dbGet("SELECT * FROM Patient WHERE email = ?", [email]);
      if (hospitalExists || patientExists) {
        return res.status(400).json({ msg: "Email already exists" });
      }
  
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const hospitalId = uuidv4();
  
      // Insert new hospital record
      await dbRun(
        `INSERT INTO Hospital (hospitalId, name, email, password, address, phoneNumber, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [hospitalId, name, email, hash, address, phoneNumber]
      );
  
      // Insert default departments for this hospital
      const defaultDepartments = ["Emergency", "Cardiology", "Neurology", "Orthopedics", "Hematology", "Pediatric"];
      for (const deptName of defaultDepartments) {
        const deptId = uuidv4();
        await dbRun(
          `INSERT INTO Department (departmentId, hospitalId, name, description, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [deptId, hospitalId, deptName, deptName]
        );
      }
  
      // Create JWT payload and sign token
      const payload = { id: hospitalId, email, role: "Hospital" };
      jwt.sign(payload, process.env.TOKEN, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.setHeader('access-token', token);
        res.json({
          token,
          role: "Hospital",
          success: true,
          id: id,
          msg: "Hospital signup successful! Default departments created."
        });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
/**
 * Shared Login for Patient and Hospital
 * Endpoint: POST /api/auth/login
 */
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      let user = null;
      let role = null;
      let id = null;
  
      // Check Admin table
      user = await dbGet("SELECT * FROM Admin WHERE email = ?", [email]);
      if (user) {
        role = "Admin";
        id = user.adminId;
      } else {
        // Check Hospital table
        user = await dbGet("SELECT * FROM Hospital WHERE email = ?", [email]);
        if (user) {
          role = "Hospital";
          id = user.hospitalId;
        } else {
          // Check Patient table
          user = await dbGet("SELECT * FROM Patient WHERE email = ?", [email]);
          if (user) {
            role = "Patient";
            id = user.patientId;
          }
        }
      }
  
      if (!user) {
        return res.status(400).json({ msg: "User not found" });
      }
  
      // Verify password
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
  
      // Create JWT payload and sign token
      const payload = { id, email, role };
      jwt.sign(
        payload,
        process.env.TOKEN,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.setHeader('access-token', token);
          res.json({
            token,
            role,
            id,
            success: true,
            msg: "Login successful!"
          });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  });



module.exports = router;
