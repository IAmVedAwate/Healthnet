import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const AddBed = () => {

  const [bedData, setBedData] = useState({ bedID: new Date().getTime() , ward: "", type: "", status: "" });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setBedData({ ...bedData, [e.target.name]: e.target.value });
  };

  const wardOptions = [
    { id: 1, value: "A", label: "A" },
    { id: 2, value: "B", label: "B" },
    { id: 3, value: "C", label: "C" },
  ];

  const statusOptions = [
    { id: 1, value: "Unoccupied", label: "Unoccupied" },
    { id: 2, value: "Occupied", label: "Occupied" },
  ];

  const typeOptions = [
    { id: 1, value: "ICU", label: "ICU" },
    { id: 2, value: "General", label: "General" },
    { id: 3, value: "Personal", label: "Personal" },
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/beds/add", bedData,{
        headers: {
          'access-token': localStorage.getItem('token'),
        },
      })
      .then(() => alert("Bed added successfully"))
      .catch((error) => console.error("Error adding bed:", error));
    navigate("/bed/get");
  };

  return (
    <div className="container mt-4">
      <div
    className="card-header rounded-top-4 bg-gradient ml-0 p-3"
    style={{ backgroundColor: '#a3ffcb' }}
  >
    <h1>Create Bed</h1>
  </div>
  <div className="card-body shadow p-4">
      <form className="mx-5" onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <label className="mb-2">Ward: </label>
            <select type="text"
              name="ward"
              className="form-select"
              placeholder="Ward"
              onChange={handleChange}
              required
            >
              <option>select Ward</option>
              {wardOptions.map((option) => (
                <option key={`targetAudienceId${option.id}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
          </div>
          <div className="col">
            <label className="mb-2">Type: </label>
            <select type="text"
              name="type"
              className="form-select"
              placeholder="Type"
              onChange={handleChange}
              required
            >
              <option>select Type</option>
              {typeOptions.map((option) => (
                <option key={`targetAudienceId${option.id}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          
          </div>
          <div className="col">
            <label className="mb-2">Status: </label>
            <select type="text"
              name="status"
              className="form-select"
              placeholder="Status"
              onChange={handleChange}
              required
            >
              <option>select Status</option>
              {statusOptions.map((option) => (
                <option key={`targetAudienceId${option.id}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-success">Create Bed</button>
        <Link to={"/bed/get"} className="mx-5 btn btn-outline-success">Go Back</Link>
      </form>
      </div>
    </div>
  );
};

export default AddBed;
