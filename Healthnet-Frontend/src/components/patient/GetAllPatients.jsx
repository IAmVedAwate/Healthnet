// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const GetAllPatients = () => {
//   const [patients, setPatients] = useState([]);
//   const handleDelete = (patientID)=>{
//     axios
//       .delete(`http://localhost:5000/api/patients/${patientID}`,{
//         headers: {
//           'access-token': localStorage.getItem('token'),
//         },
//       })
//       .then(() => alert("Patient deleted successfully"))
//       .catch((error) => console.error("Error deleting patient:", error));
//   }
//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/patients/",{
//         headers: {
//           'access-token': localStorage.getItem('token'),
//         },
//       })
//       .then((response) => setPatients(response.data))
//       .catch((error) => console.error("Error fetching patients:", error));
//   }, [handleDelete]);


//   return (
//     <div className="container">
//       <div className="card-header rounded-top-4 bg-gradient ml-0 p-3" style={{ backgroundColor: "#a3dcff" }}>

// <div className="row">
//   <div className="col-6">
//     <h1 className="px-3">All Patients</h1>
//   </div>
//   <div className="col-6 text-end">

//     <Link to={"/patient/add"} className="btn btn-success">Add Patient</Link>
//   </div>
// </div>
// </div>
// <div className="card-body bg-white shadow p-4">
//       <table className="table table-striped">
//         <thead>
//           <tr>
//             <th>Patient ID</th>
//             <th>Name</th>
//             <th>Age</th>
//             <th>Gender</th>
//             <th>Contact Info</th>
//             <th>Assigned Doctor</th>
//             <th>Status</th>
//             <th></th>
//           </tr>
//         </thead>
//         <tbody>
//           {patients.map((patient) => (
//             <tr key={patient.patientID}>
//               <td>{patient.patientID}</td>
//               <td>{patient.name}</td>
//               <td>{patient.age}</td>
//               <td>{patient.gender}</td>
//               <td>{patient.contactInfo}</td>
//               <td>{patient.assignedDoctor}</td>
//               <td>{patient.status}</td>
//               <td style={{ width: "160px" }} className="text-center">
//                   <Link to={`/patient/update/${patient.patientID}`} className="btn btn-primary px-3 mx-2"><i className="bi bi-plus-circle-fill"></i></Link>
//                   <button onClick={()=>handleDelete(patient.patientID)} className="btn btn-danger px-3 mx-2"><i className="bi bi-trash-fill"></i></button>
//                 </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//     </div>
//   );
// };

// export default GetAllPatients;

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const GetAllPatients = () => {
  const [patients, setPatients] = useState([]);

  const fetchPatients = useCallback(() => {
    axios
      .get("http://localhost:5000/api/patients/all", {
        headers: {
          "access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => setPatients(response.data))
      .catch((error) => console.error("Error fetching patients:", error));
  }, []);
  console.log(patients)

  const handleDelete = (patientID) => {
    axios
      .delete(`http://localhost:5000/api/patients/${patientID}`, {
        headers: {
          "access-token": localStorage.getItem("token"),
        },
      })
      .then(() => {
        alert("Patient deleted successfully");
        fetchPatients(); // Refresh the list after deletion
      })
      .catch((error) => console.error("Error deleting patient:", error));
  };

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return (
    <div className="container">
      <div className="card-header rounded-top-4 bg-gradient ml-0 p-3" style={{ backgroundColor: "#a3dcff" }}>
        <div className="row">
          <div className="col-6">
            <h1 className="px-3">All Patients</h1>
          </div>
          <div className="col-6 text-end">
            <Link to="/patient/add" className="btn btn-success">
              Add Patient
            </Link>
          </div>
        </div>
      </div>

      <div className="card-body bg-white shadow p-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Contact Info</th>
              <th>Assigned Doctor</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.patientDataId}>
                <td>{patient.patientDataId}</td>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.contactInfo}</td>
                <td>{patient.doctorId}</td>
                <td>{patient.status}</td>
                <td style={{ width: "160px" }} className="text-center">
                  <Link to={`/patient/edit/${patient.patientDataId}`} className="btn btn-primary px-3 mx-2">
                    <i className="bi bi-plus-circle-fill"></i>
                  </Link>
                  <button
                    onClick={() => handleDelete(patient.patientDataId)}
                    className="btn btn-danger px-3 mx-2"
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-muted py-3">
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetAllPatients;
