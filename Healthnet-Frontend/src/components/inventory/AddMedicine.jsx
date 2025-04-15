import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AddMedicine = () => {
  const [medicine, setMedicine] = useState({
    medicineID: new Date().getTime(),
    name: "",
    quantity: 0,
    expiryDate: "",
  });

  const handleChange = (e) => {
    setMedicine({ ...medicine, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(medicine);

    axios
      .post("http://localhost:5000/api/inventories/add", medicine,{
        headers: {
          'access-token': localStorage.getItem('token'),
        },
      })
      .then(() => alert("Medicine added successfully"))
      .catch((error) => console.error("Error adding medicine:", error));
    navigate("/inventory/get");
  };

  return (
    <div className="container">
      <div
        className="card-header rounded-top-4 bg-gradient ml-0 p-3"
        style={{ backgroundColor: '#a3ffcb' }}
      >
        <h1>Add Medicine</h1>
      </div>
      <div className="card-body shadow p-4">
        <form onSubmit={handleSubmit} className="row g-3 mt-3">
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="quantity" className="form-label">
              Quantity
            </label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              name="quantity"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="expiryDate" className="form-label">
              Expiry Date
            </label>
            <input
              type="date"
              className="form-control"
              id="expiryDate"
              name="expiryDate"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Add Medicine
            </button>
          <Link to={"/inventory/get"} className="mx-5 btn btn-outline-primary">Go Back</Link>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;
