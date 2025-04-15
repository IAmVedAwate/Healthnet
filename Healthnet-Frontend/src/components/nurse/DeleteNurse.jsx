import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeleteNurse = () => {
  const [nurseID, setNurseID] = useState("");
const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .delete(`http://localhost:5000/api/nurses/${nurseID}`)
      .then((response) => alert("Nurse deleted successfully"))
      .catch((error) => console.error("Error deleting nurse:", error));
    navigate("/nurse/get");
  };

  return (
    <div className="container">
      <h2>Delete Nurse</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="nurseID" className="form-label">Nurse ID</label>
          <input type="text" className="form-control" onChange={(e) => setNurseID(e.target.value)} required />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-danger">Delete Nurse</button>
        </div>
      </form>
    </div>
  );
};

export default DeleteNurse;
