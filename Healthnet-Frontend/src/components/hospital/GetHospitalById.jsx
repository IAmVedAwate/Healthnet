import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const GetHospitalById = () => {
  const [hospitalID, setHospitalID] = useState("");
  const [hospital, setHospital] = useState(null);
  const {token} = useSelector((state) => state.auth)
 
  const handleSearch = () => {
    axios
      .get(`http://localhost:5000/api/hospitals/${hospitalID}`,{
        headers: {
          'access-token': token,
        },
      })
      .then((response) => setHospital(response.data))
      .catch((error) => console.error(error));
  };

  return (
    <div className="container mt-4">
      <h2>Search Hospital by ID</h2>
      <div className="mb-3">
        <label className="form-label">Hospital ID</label>
        <input
          type="text"
          className="form-control"
          value={hospitalID}
          onChange={(e) => setHospitalID(e.target.value)}
        />
        <button onClick={handleSearch} className="btn btn-primary mt-3">Search</button>
      </div>
      {hospital && (
        <div className="mt-4">
          <h4>Details</h4>
          <p><strong>ID:</strong> {hospital.hospitalID}</p>
          <p><strong>Name:</strong> {hospital.hospitalName}</p>
          <p><strong>Location:</strong> {hospital.hospitalLocation}</p>
          <p><strong>Contact Info:</strong> {hospital.hospitalContactInfo}</p>
        </div>
      )}
    </div>
  );
};

export default GetHospitalById;
