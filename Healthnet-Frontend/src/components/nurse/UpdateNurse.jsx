import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdateNurse = () => {
  const [nurseID, setNurseID] = useState("");
  const [nurse, setNurse] = useState({
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
      .put(`http://localhost:5000/api/nurses/${nurseID}`, nurse)
      .then((response) => alert("Nurse updated successfully"))
      .catch((error) => console.error("Error updating nurse:", error));
    navigate("/nurse/get");
  };

  return (
    <div className="container">
      <h2>Update Nurse</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="nurseID" className="form-label">Nurse ID</label>
          <input type="text" className="form-control" onChange={(e) => setNurseID(e.target.value)} required />
        </div>
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" name="name" className="form-control" onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="contactInfo" className="form-label">Contact Info</label>
          <input type="text" name="contactInfo" className="form-control" onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="hospital" className="form-label">Hospital</label>
          <input type="text" name="hospital" className="form-control" onChange={handleChange} />
        </div>
        <div className="col-md-12">
          <label className="form-check-label">
            <input type="checkbox" name="isAvailable" className="form-check-input" onChange={handleChange} />
            Is Available
          </label>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-warning">Update Nurse</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateNurse;
