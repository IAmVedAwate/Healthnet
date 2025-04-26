// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router";

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
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { Pencil, Trash } from "lucide-react";
import { toast } from "react-toastify";

const GetAllPatients = () => {
  const [patients, setPatients] = useState([]);
  const { token, id } = useSelector((state) => state.auth);

  const fetchPatients = useCallback(() => {
    axios
      .get("http://localhost:5000/api/patients/all", {
        headers: {
          "access-token": token,
        },
      })
      .then((response) => setPatients(response.data))
      .catch((error) => console.error("Error fetching patients:", error));
  }, [token]);

  const handleDelete = (patientID) => {
    axios
      .delete(`http://localhost:5000/api/patients/${patientID}`, {
        headers: {
          "access-token": token,
        },
      })
      .then(() => {
        toast.success("Patient deleted successfully");
        fetchPatients(); // Refresh the list after deletion
      })
      .catch((error) => console.error("Error deleting patient:", error));
  };

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gradient-to-r bg-indigo-600  rounded-t-lg p-3">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold px-3">All Patients</h1>
          <Link
            to="/patient/add"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Add Patient
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 mt-4">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Patient ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Age</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Gender</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Contact Info</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Assigned Doctor</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.patientDataId} className="border-b">
                <td className="px-4 py-2 text-sm text-gray-800">{patient.patientDataId}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{patient.name}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{patient.age}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{patient.gender}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{patient.contactInfo}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{patient.doctorId}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{patient.status}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex">
                  <Link
                    to={`/patient/edit/${patient.patientDataId}`}
                    className="bg-blue-500 text-white  px-3 py-2 rounded-md mx-2 hover:bg-blue-600 transition"
                  >
                    <Pencil />
                  </Link>
                  <button
                    onClick={() => handleDelete(patient.patientDataId)}
                    className="bg-red-500 text-white px-3 py-2 rounded-md mx-2 hover:bg-red-600 transition"
                  >
                    <Trash />
                  </button>
                 </div>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-gray-400 py-3">
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

