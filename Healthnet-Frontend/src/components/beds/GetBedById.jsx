import React, { useState } from "react";
import axios from "axios";

const GetBedById = () => {
  const [bedID, setBedID] = useState("");
  const [bed, setBed] = useState(null);

  const fetchBed = () => {
    axios
      .get(`http://localhost:5000/api/beds/${bedID}`,{
        headers: {
          'access-token': localStorage.getItem('token'),
        },
      })
      .then((response) => setBed(response.data))
      .catch((error) => console.error("Error fetching bed:", error));
  };

  return (
    <div className="container mt-4">
      <h2>Get Bed Details</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Bed ID"
          value={bedID}
          onChange={(e) => setBedID(e.target.value)}
        />
      </div>
      <button className="btn btn-info" onClick={fetchBed}>
        Fetch Details
      </button>
      {bed && (
        <div className="mt-4">
          <h4>Bed Details</h4>
          <p><strong>Bed ID:</strong> {bed.bedID}</p>
          <p><strong>Ward:</strong> {bed.ward}</p>
          <p><strong>Type:</strong> {bed.type}</p>
          <p><strong>Status:</strong> {bed.status}</p>
        </div>
      )}
    </div>
  );
};

export default GetBedById;
