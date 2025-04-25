import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const DeletePatient = () => {
  const [patientID, setPatientID] = useState("");
  const navigate = useNavigate();
  const {token} = useSelector((state) => state.auth)

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .delete(`http://localhost:5000/api/patients/${patientID}`, {
        headers: {
          "access-token": token,
        },
      })
      .then(() => {
        alert("Patient deleted successfully");
        navigate("/patient/get");
      })
      .catch((error) => console.error("Error deleting patient:", error));
  };

  return (
    <div className="container">
      <h2>Delete Patient</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label">Patient ID:</label>
        <input className="form-control w-25" type="text" onChange={(e) => setPatientID(e.target.value)} required />
        <button className="btn btn-danger my-2" type="submit">Delete</button>
      </form>
    </div>
  );
};

export default DeletePatient;
