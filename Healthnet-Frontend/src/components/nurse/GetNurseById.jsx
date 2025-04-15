import React, { useState } from "react";
import axios from "axios";

const GetNurseById = () => {
  const [nurseID, setNurseID] = useState("");
  const [nurse, setNurse] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get(`http://localhost:5000/api/nurses/${nurseID}`)
      .then((response) => setNurse(response.data))
      .catch((error) => console.error("Error fetching nurse:", error));
  };

  return (
    <div className="container">
      <h2>Get Nurse by ID</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="nurseID" className="form-label">Nurse ID</label>
          <input type="text" className="form-control" onChange={(e) => setNurseID(e.target.value)} required />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-info">Fetch Nurse</button>
        </div>
      </form>
      {nurse && (
        <div className="mt-4">
          <h4>Nurse Details</h4>
          <p>Name: {nurse.name}</p>
          <p>Is Available: {nurse.isAvailable ? "Yes" : "No"}</p>
          <p>Contact Info: {nurse.contactInfo}</p>
          <p>Hospital: {nurse.hospital}</p>
        </div>
      )}
    </div>
  );
};

export default GetNurseById;
