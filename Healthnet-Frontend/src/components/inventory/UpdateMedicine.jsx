import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const UpdateMedicine = () => {
  const {inventoryid} = useParams();
  const [medicine, setMedicine] = useState({
    name: "",
    quantity: 0,
    expiryDate: "",
  });
const navigate = useNavigate();
  useEffect(() => {
    const fetchEditable = ()=>{
      axios
      .get(`http://localhost:5000/api/inventories/${inventoryid}`,{
        headers: {
          'access-token': localStorage.getItem('token'),
        },
      })
      .then((response) => {
        setMedicine({
        name: response.data.name,
        quantity: response.data.quantity,
        expiryDate: response.data.expiryDate,
        })
      })
      .catch((error) => console.error("Error fetching medicine:", error));
    }
    fetchEditable();
  }, [])
  
  const handleChange = (e) => {
    setMedicine({ ...medicine, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/inventories/${inventoryid}`, medicine,{
        headers: {
          'access-token': localStorage.getItem('token'),
        },
      })
      .then((response) => alert("Medicine updated successfully"))
      .catch((error) => console.error("Error updating medicine:", error));
  };

  return (
    <div className="container">
      <div
        className="card-header rounded-top-4 bg-gradient ml-0 p-3"
        style={{ backgroundColor: '#a3ffcb' }}
      >
        <h1>Update Medicine</h1>
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
            defaultValue={medicine.name}
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
            value={Number(medicine.quantity)}
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
            defaultValue={medicine.expiryDate}
            required
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-warning">
            Update Medicine
          </button>
          <Link to={"/inventory/get"} className="mx-5 btn btn-outline-warning">Go Back</Link>

        </div>
      </form>
      </div>
    </div>
  );
};

export default UpdateMedicine;
