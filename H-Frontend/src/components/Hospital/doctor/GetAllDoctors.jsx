// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router";

// const GetAllDoctors = () => {
//   const [doctors, setDoctors] = useState([]);
//   const navigate = useNavigate();

//   const fetchDoctors = () => {
//     const hospitalId = localStorage.getItem("hospitalId");
//     axios
//       .get(`http://localhost:5000/api/doctors/all/${hospitalId}`, {
//         headers: {
//           "access-token": token,
//         },
//       })
//       .then((response) => setDoctors(response.data))
//       .catch((error) => console.error("Error fetching doctors:", error));
//   };
// console.log(doctors)
//   const handleDelete = (doctorId) => {
//     axios
//       .delete(`http://localhost:5000/api/doctors/${doctorId}`, {
//         headers: {
//           "access-token": token,
//         },
//       })
//       .then(() => {
//         alert("Doctor deleted successfully");
//         fetchDoctors();
//       })
//       .catch((error) => console.error(error));
//   };

//   const handleEnterClick = (doctorId) => {
//     navigate(`/doctor/dashboard/${doctorId}`);
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   return (
//     <div className="container mt-4">
//       <div
//         className="card-header rounded-top-4 bg-gradient ml-0 p-3"
//         style={{ backgroundColor: "#a3dcff" }}
//       >
//         <div className="row">
//           <div className="col-6">
//             <h1 className="px-3">All Doctors</h1>
//           </div>
//           <div className="col-6 text-end">
//             <Link to={"/doctor/add"} className="btn btn-success">
//               Add New Doctor
//             </Link>
//           </div>
//         </div>
//       </div>
//       <div className="card-body bg-white shadow p-4">
//         <table className="table table-striped">
//           <thead>
//             <tr>
//               {/* <th>ID</th> */}
//               <th>Name</th>
//               <th>Specialization</th>
//               <th>Contact Info</th>
//               {/* <th>Hospital</th> */}
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {doctors.map((doctor) => (
//               <tr key={doctor.doctorId}>
//                 {/* <td>{doctor.doctorId}</td> */}
//                 <td>{doctor.firstName} {doctor.lastName}</td>
//                 <td>{doctor.specialization}</td>
//                 <td>{doctor.phoneNumber}</td>
//                 {/* <td>{doctor.hospitalId}</td> */}
//                 <td style={{ width: "220px" }} className="text-center">
//                   <button
//                     onClick={() => handleEnterClick(doctor.doctorId)}
//                     className="btn btn-success px-2 mx-2"
//                   >
//                     Enter
//                   </button>
//                   <Link
//                     to={`/doctor/update/${doctor.doctorId}`}
//                     className="btn btn-primary px-3 mx-1"
//                   >
//                     <i className="bi bi-pencil-square"></i>
//                   </Link>
//                   <button
//                     onClick={() => handleDelete(doctor.doctorId)}
//                     className="btn btn-danger px-3 mx-1"
//                   >
//                     <i className="bi bi-trash"></i>
//                   </button>
                  
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default GetAllDoctors;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";

const GetAllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const { token, id } = useSelector((state) => state.auth);

  const fetchDoctors = () => {
    const hospitalId = id;
    axios
      .get(`http://localhost:5000/api/doctors/all/${hospitalId}`, {
        headers: {
          "access-token": token,
        },
      })
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  };

  const handleDelete = (doctorId) => {
    axios
      .delete(`http://localhost:5000/api/doctors/${doctorId}`, {
        headers: {
          "access-token": token,
        },
      })
      .then(() => {
        alert("Doctor deleted successfully");
        fetchDoctors();
      })
      .catch((error) => console.error(error));
  };

  const handleEnterClick = (doctorId) => {
    navigate(`/doctor/dashboard/${doctorId}`);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="mx-auto px-6 sm:px-8 lg:px-10 mt-10">
      {/* Header */}
      <div className="bg-indigo-600 text-white rounded-t-lg px-6 py-4 flex items-center justify-between shadow-md">
        <h1 className="text-2xl font-semibold">All Doctors</h1>
        <Link
          to="/doctor/add"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 ease-in-out shadow-md"
        >
          Add New Doctor
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-b-lg overflow-x-auto mt-4">
        <table className="min-w-full table-auto divide-y divide-gray-300 text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Name</th>
              <th className="px-6 py-3 text-left font-semibold">Specialization</th>
              <th className="px-6 py-3 text-left font-semibold">Contact Info</th>
              <th className="px-6 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {doctors.map((doctor) => (
              <tr key={doctor.doctorId} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {doctor.firstName} {doctor.lastName}
                </td>
                <td className="px-6 py-4">{doctor.specialization}</td>
                <td className="px-6 py-4">{doctor.phoneNumber}</td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    onClick={() => handleEnterClick(doctor.doctorId)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 ease-in-out shadow-md"
                  >
                    Enter
                  </button>
                  <Link
                    to={`/doctor/update/${doctor.doctorId}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out shadow-md"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(doctor.doctorId)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 ease-in-out shadow-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {doctors.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No doctors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetAllDoctors;

