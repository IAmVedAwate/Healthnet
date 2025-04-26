import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddPatient = () => {
  const { id, token } = useSelector((state) => state.auth);
  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    contactInfo: "",
    doctorId: "",
    status: "Pending",
    hospitalId: id
  });
  
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


  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/patients/add", patient, {
        headers: {
          "access-token": token,
        },
      })
      .then(() => {
        toast.success("Patient added successfully");
        navigate("/patient/get");
      })
      .catch((error) => console.error("Error adding patient:", error));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-green-400 to-teal-300 rounded-t-lg p-4 mb-6">
        <h1 className="text-2xl font-semibold text-white">Add Patient</h1>
      </div>
      <div className="bg-white shadow-lg p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                name="age"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={handleChange}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Info</label>
              <input
                type="text"
                name="contactInfo"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Assigned Doctor</label>
              <select
  name="doctorId"
  className="mt-2 p-2 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
  onChange={handleChange}
  required
>
  <option value="">Select Doctor</option>
  {doctors.map((doctor) => (
    <option key={doctor.doctorId} value={doctor.doctorId}>
      {doctor.firstName} {doctor.lastName }
    </option>
  ))}
</select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={handleChange}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Under Treatment">Under Treatment</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-4 mt-6">
            <button type="submit" className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none">
              Add Patient
            </button>
            <Link to="/patient/get" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none">
              Go Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;
