import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddNurse = () => {
  const [nurse, setNurse] = useState({
    nurseID: "",
    name: "",
    isAvailable: false,
    contactInfo: "",
    hospital: "",
  });
const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNurse({ ...nurse, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/nurses/add", nurse)
      .then((response) => alert("Nurse added successfully"))
      .catch((error) => console.error("Error adding nurse:", error));
    navigate("/nurse/get");
  };

  return (
    <div className="container">
      <h2>Add Nurse</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="nurseID" className="form-label">Nurse ID</label>
          <input type="text" name="nurseID" className="form-control" onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" name="name" className="form-control" onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label htmlFor="contactInfo" className="form-label">Contact Info</label>
          <input type="text" name="contactInfo" className="form-control" onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label htmlFor="hospital" className="form-label">Hospital</label>
          <input type="text" name="hospital" className="form-control" onChange={handleChange} required />
        </div>
        <div className="col-md-12">
          <label className="form-check-label">
            <input type="checkbox" name="isAvailable" className="form-check-input" onChange={handleChange} />
            Is Available
          </label>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">Add Nurse</button>
        </div>
      </form>
    </div>
  );
};

export default AddNurse;
