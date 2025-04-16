import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AddPatient = () => {
  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    contactInfo: "",
    doctorId: "",
    status: "Pending",
    hospitalId: "d6224e00-b9fa-4cce-b3a8-6ae76df3c030"
  });

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
          "access-token": localStorage.getItem("token"),
        },
      })
      .then(() => {
        alert("Patient added successfully");
        navigate("/patient/get");
      })
      .catch((error) => console.error("Error adding patient:", error));
  };

  return (
    <div className="container">
      <div className="card-header rounded-top-4 bg-gradient ml-0 p-3" style={{ backgroundColor: "#a3ffcb" }}>
        <h1>Add Patient</h1>
      </div>
      <div className="card-body shadow p-4">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input type="text" name="name" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Age</label>
            <input type="number" name="age" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Gender</label>
            <select name="gender" className="form-select" onChange={handleChange} required>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Contact Info</label>
            <input type="text" name="contactInfo" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Assigned Doctor</label>
            <input type="text" name="doctorId" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select name="status" className="form-select" onChange={handleChange} required>
              <option value="Pending">Pending</option>
              <option value="Under Treatment">Under Treatment</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">Add Patient</button>
            <Link to={"/patient/get"} className="mx-5 btn btn-outline-primary">Go Back</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;
