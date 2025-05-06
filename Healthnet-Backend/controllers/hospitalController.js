const { promisify } = require('util');
const db = require('../dbSetup');  // Your SQLite database instance

const dbGet = promisify(db.get).bind(db);
const dbAll = promisify(db.all).bind(db);

// const getAllHospitals = async (req, res) => {
//   try {
//     // Retrieve all hospital records from the Hospital table.
//     const hospitals = await dbAll("SELECT * FROM Hospital");
//     const mainData = [];
    
//     for (let hospital of hospitals) {
//       const countRow = await dbGet(
//         "SELECT COUNT(*) AS count FROM Appointment WHERE hospitalId = ?",
//         [hospital.hospitalId]
//       );
      
//       mainData.push({
//         hospitalId: hospital.hospitalId,
//         hospitalName: hospital.name,
//         hospitalLocation: hospital.address,
//         hospitalContactInfo: hospital.phoneNumber,
//         peopleInQueue: countRow ? countRow.count : 0,
//       });
//     }
    
//     res.status(200).json(mainData);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching hospitals', error: err.message });
//   }
// };

const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await dbAll("SELECT * FROM Hospital");
    const mainData = [];

    for (let hospital of hospitals) {
      // Count appointments
      const countRow = await dbGet(
        "SELECT COUNT(*) AS count FROM Appointment WHERE hospitalId = ?",
        [hospital.hospitalId]
      );

      // Count available beds: beds with NULL patientId in rooms of this hospital
      const availableBedRow = await dbGet(
        `
        SELECT COUNT(*) AS availableBeds
        FROM Bed
        JOIN Room ON Bed.roomId = Room.roomId
        WHERE Room.hospitalId = ? AND Bed.patientId IS NULL
        `,
        [hospital.hospitalId]
      );

      mainData.push({
        hospitalId: hospital.hospitalId,
        hospitalName: hospital.name,
        hospitalLocation: hospital.address,
        hospitalContactInfo: hospital.phoneNumber,
        peopleInQueue: countRow?.count || 0,
        availableBeds: availableBedRow?.availableBeds || 0,
      });
    }

    res.status(200).json(mainData);
  } catch (err) {
    console.error("Error fetching hospitals:", err);
    res.status(500).json({ message: 'Error fetching hospitals', error: err.message });
  }
};

/**
 * GET /api/hospitals/:id
 * Returns a hospital record by hospitalId.
 */
const getHospitalById = async (req, res) => {
  try {
    const { id } = req.params;
    // Query the Hospital table using hospitalId.
    const hospital = await dbGet("SELECT * FROM Hospital WHERE hospitalId = ?", [id]);
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    
    res.status(200).json(hospital);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching hospital', error: err.message });
  }
};

const getDepartmentsByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const departments = await dbAll(
      "SELECT * FROM Department WHERE hospitalId = ?",
      [hospitalId]
    );
    res.status(200).json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching departments', error: err.message });
  }
};

const getAllDepartment = async (req, res) => {
  try {
    const dept = await dbAll("SELECT DISTINCT * FROM Department")
    console.log(dept);
    res.status(200).json(dept)
  } catch (error) {
    res.status(500).json({message:"error pata nhi ", error: error.message})
    
  }
}


module.exports = { getAllHospitals, getHospitalById, getDepartmentsByHospital,getAllDepartment };
