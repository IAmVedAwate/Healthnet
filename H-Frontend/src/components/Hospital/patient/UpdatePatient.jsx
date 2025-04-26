import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const UpdatePatient = () => {
  const { token ,id } = useSelector((state) => state.auth);
  const { patientid } = useParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  // Fetch doctors when the component mounts
useEffect(() => {
  axios
    .get(`http://localhost:5000/api/doctors/all/${id}`, {
      headers: {
        "access-token": token,
      },
    })
    .then((response) => {
      setDoctors(response.data); // Assuming the response contains the list of doctors
    })
    .catch((error) => console.error("Error fetching doctors:", error));
}, [token]);


  const [updatedData, setUpdatedData] = useState({
    name: "",
    age: "",
    gender: "Male",
    contactInfo: "",
    doctorId: "",
    status: "Pending",
    hospitalId: id,
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/patients/byId/${patientid}`, {
        headers: { "access-token": token },
      })
      .then((res) => setUpdatedData(res.data))
      .catch((err) => console.error("Error fetching patient:", err));
  }, [patientid, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/patients/${patientid}`, updatedData, {
        headers: { "access-token": token },
      })
      .then(() => {
        toast.success("Patient updated successfully");
        navigate("/patient/get");
      })
      .catch((err) => console.error("Error updating patient:", err));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-green-100 rounded-t-lg px-6 py-4 shadow">
        <h1 className="text-2xl font-bold text-green-900">Update Patient</h1>
      </div>

      <div className="bg-white shadow-lg rounded-b-lg px-6 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={updatedData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={updatedData.age}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={updatedData.gender}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
            <input
              type="text"
              name="contactInfo"
              value={updatedData.contactInfo}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Doctor ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Doctor ID</label>
            <div>


 
  {/* Doctor selection dropdown */}
  <select
    name="doctorId"
    value={updatedData.doctorId}
    onChange={handleChange}
    required
    className="mt-1 p-2 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
  >
    <option value="">Select Doctor</option>
    {doctors.map((doctor) => (
      <option key={doctor.doctorId} value={doctor.doctorId}>
        Dr. {doctor.firstName} {doctor.lastName}
      </option>
    ))}
  </select>
</div>

            
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={updatedData.status}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option>Pending</option>
              <option>Under Treatment</option>
              <option>Discharged</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="col-span-1 md:col-span-2 flex justify-start items-center gap-4 mt-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md transition"
            >
              Update
            </button>
            <Link
              to="/patient/get"
              className="text-yellow-600 border border-yellow-400 hover:bg-yellow-100 px-5 py-2 rounded-md transition"
            >
              Go Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePatient;
