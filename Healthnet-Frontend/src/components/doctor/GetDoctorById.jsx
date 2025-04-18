import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GetDoctorById = () => {
  const [doctorID, setDoctorID] = useState("");
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();
  const {token} = useSelector((state) => state.auth)

  const handleSearch = () => {
    axios
      .get(`http://localhost:5000/api/doctors/${doctorID}`, {
        headers: {
          'access-token': token,
        },
      })
      .then((response) => setDoctor(response.data))
      .catch((error) => console.error("Error fetching doctor:", error));
  };

  return (
    <div className="container mt-4">
      <h2>Get Doctor by ID</h2>
      <div className="mb-3">
        <label className="form-label">Doctor ID</label>
        <input
          type="text"
          className="form-control"
          value={doctorID}
          onChange={(e) => setDoctorID(e.target.value)}
        />
        <button onClick={handleSearch} className="btn btn-primary mt-3">
          Search
        </button>
      </div>
      {doctor && (
        <div className="mt-4">
          <h4>Doctor Details</h4>
          <p><strong>ID:</strong> {doctor.doctorId}</p>
          <p><strong>Name:</strong> {doctor.firstName} {doctor.lastName}</p>
          <p><strong>Specialization:</strong> {doctor.specialization}</p>
          <p><strong>Contact Info:</strong> {doctor.phoneNumber}</p>
          <p><strong>Hospital:</strong> {doctor.hospitalId}</p>
        </div>
      )}
    </div>
  );
};

export default GetDoctorById;
