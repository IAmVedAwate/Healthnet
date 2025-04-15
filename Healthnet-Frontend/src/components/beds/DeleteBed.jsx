import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeleteBed = () => {
  const [bedID, setBedID] = useState("");
  const navigate = useNavigate();
  const handleDelete = (bedID) => {
    axios
      .delete(`http://localhost:5000/api/beds/${bedID}`,{
        headers: {
          'access-token': localStorage.getItem('token'),
        },
      })
      .then(() => alert("Bed deleted successfully"))
      .catch((error) => console.error("Error deleting bed:", error));
      navigate("/bed/get");
  };

  return (
    <div className="container mt-4">
      <h2>Delete Bed</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Bed ID"
          value={bedID}
          onChange={(e) => setBedID(e.target.value)}
        />
      </div>
      <button className="btn btn-danger" onClick={handleDelete}>
        Delete Bed
      </button>
    </div>
  );
};

export default DeleteBed;
