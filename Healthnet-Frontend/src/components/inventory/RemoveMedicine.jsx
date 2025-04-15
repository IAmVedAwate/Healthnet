import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RemoveMedicine = () => {
  const [medicineID, setMedicineID] = useState("");
const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .delete(`http://localhost:5000/api/inventories/remove/${medicineID}`,{
        headers: {
          'access-token': localStorage.getItem('token'),
        },
      })
      .then((response) => alert("Medicine removed successfully"))
      .catch((error) => console.error("Error removing medicine:", error));
    navigate("/inventory/get");
  };

  return (
    <div className="container">
      <h2 className="mt-4">Remove Medicine</h2>
      <form onSubmit={handleSubmit} className="row g-3 mt-3">
        <div className="col-md-6">
          <label htmlFor="medicineID" className="form-label">
            Medicine ID
          </label>
          <input
            type="text"
            className="form-control"
            id="medicineID"
            onChange={(e) => setMedicineID(e.target.value)}
            required
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-danger">
            Remove Medicine
          </button>
        </div>
      </form>
    </div>
  );
};

export default RemoveMedicine;
