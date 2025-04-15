import React, { useState } from "react";
import axios from "axios";

const GetInventoryItemById = () => {
  const [medicineID, setMedicineID] = useState("");
  const [medicine, setMedicine] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get(`http://localhost:5000/api/inventories/${medicineID}`,{
        headers: {
          'access-token': localStorage.getItem('token'),
        },
      })
      .then((response) => setMedicine(response.data))
      .catch((error) => console.error("Error fetching medicine:", error));
  };

  return (
    <div className="container">
      <h2 className="mt-4">Get Medicine by ID</h2>
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
          <button type="submit" className="btn btn-info">
            Fetch Medicine
          </button>
        </div>
      </form>
      {medicine && (
        <div className="mt-4">
          <h5>Medicine Details:</h5>
          <p>Name: {medicine.name}</p>
          <p>Quantity: {medicine.quantity}</p>
          <p>Expiry Date: {new Date(medicine.expiryDate).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default GetInventoryItemById;
