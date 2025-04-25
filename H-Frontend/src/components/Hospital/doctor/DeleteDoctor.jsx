import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const DeleteDoctor = () => {
  const [doctorId, setDoctorId] = useState("");
  const navigate = useNavigate();
  const {token}= useSelector((state) => state.auth)

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/api/doctors/${doctorId}`, {
        headers: {
          "access-token": token,
        },
      })
      .then(() => {
        alert("Doctor deleted successfully");
        navigate("/doctor/get");
      })
      .catch((error) => {
        console.error(error);
        alert("Error deleting doctor");
      });
  };

  return (
    <div className="container mt-4">
      <h2>Delete Doctor</h2>
      <div className="mb-3">
        <label className="form-label">Doctor ID</label>
        <input
          type="text"
          className="form-control"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
        />
        <button onClick={handleDelete} className="btn btn-danger mt-3">
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteDoctor;
