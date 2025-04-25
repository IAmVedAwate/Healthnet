// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router";
// import { useSelector } from "react-redux";

// const GetDoctorById = () => {
//   const [doctorID, setDoctorID] = useState("");
//   const [doctor, setDoctor] = useState(null);
//   const navigate = useNavigate();
//   const {token} = useSelector((state) => state.auth)

//   const handleSearch = () => {
//     axios
//       .get(`http://localhost:5000/api/doctors/${doctorID}`, {
//         headers: {
//           'access-token': token,
//         },
//       })
//       .then((response) => setDoctor(response.data))
//       .catch((error) => console.error("Error fetching doctor:", error));
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Get Doctor by ID</h2>
//       <div className="mb-3">
//         <label className="form-label">Doctor ID</label>
//         <input
//           type="text"
//           className="form-control"
//           value={doctorID}
//           onChange={(e) => setDoctorID(e.target.value)}
//         />
//         <button onClick={handleSearch} className="btn btn-primary mt-3">
//           Search
//         </button>
//       </div>
//       {doctor && (
//         <div className="mt-4">
//           <h4>Doctor Details</h4>
//           <p><strong>ID:</strong> {doctor.doctorId}</p>
//           <p><strong>Name:</strong> {doctor.firstName} {doctor.lastName}</p>
//           <p><strong>Specialization:</strong> {doctor.specialization}</p>
//           <p><strong>Contact Info:</strong> {doctor.phoneNumber}</p>
//           <p><strong>Hospital:</strong> {doctor.hospitalId}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GetDoctorById;


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const GetDoctorById = () => {
  const [doctorID, setDoctorID] = useState("");
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/doctors/${doctorID}`, {
        headers: {
          "access-token": token,
        },
      });
      setDoctor(response.data);
    } catch (error) {
      console.error("Error fetching doctor:", error);
      setDoctor(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Search Doctor by ID</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
            Enter Doctor ID
          </label>
          <input
            type="text"
            id="doctorId"
            value={doctorID}
            onChange={(e) => setDoctorID(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-3 py-2"
            placeholder="e.g., H001-D003"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded shadow"
        >
          Search
        </button>
      </div>

      {doctor && (
        <div className="mt-8 bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-emerald-700 mb-4">Doctor Details</h3>
          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-medium">Doctor ID:</span> {doctor.doctorId}
            </p>
            <p>
              <span className="font-medium">Name:</span> {doctor.firstName} {doctor.lastName}
            </p>
            <p>
              <span className="font-medium">Specialization:</span> {doctor.specialization}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {doctor.phoneNumber}
            </p>
            <p>
              <span className="font-medium">Hospital ID:</span> {doctor.hospitalId}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetDoctorById;
