import React, { useState } from "react";
import axios from "axios";

const GetPatientById = () => {
  const [patientID, setPatientID] = useState("");
  const [patient, setPatient] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get(`http://localhost:5000/api/patients/${patientID}`, {
        headers: {
          "access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => setPatient(response.data))
      .catch((error) => console.error("Error fetching patient:", error));
  };

  return (
    <div className="container">
      <h2>Get Patient by ID</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label">Patient ID:</label>
        <input className="form-control w-25" type="text" onChange={(e) => setPatientID(e.target.value)} required />
        <button className="btn btn-secondary my-2" type="submit">Fetch</button>
      </form>
      {patient && (
        <div className="mt-4">
          <h3>Patient Details</h3>
          <p>Name: {patient.username}</p>
          <p>Age: {patient.age}</p>
          <p>Gender: {patient.gender}</p>
          <p>Contact Info: {patient.contactInfo}</p>
          <p>Assigned Doctor: {patient.assignedDoctor}</p>
          <p>Status: {patient.status}</p>
        </div>
      )}
    </div>
  );
};

export default GetPatientById;
