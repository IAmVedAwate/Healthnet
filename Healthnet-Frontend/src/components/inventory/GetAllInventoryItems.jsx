import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const GetAllInventoryItems = () => {
  const [inventory, setInventory] = useState([]);

  const handleDelete = (medicineID) => {
    axios
      .delete(`http://localhost:5000/api/inventories/remove/${medicineID}`,{
        headers: {
          'access-token': localStorage.getItem('token'),
        },
      })
      .then((response) => alert("Medicine removed successfully"))
      .catch((error) => console.error("Error removing medicine:", error));
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/inventories",{
        headers: {
          'access-token': localStorage.getItem('token'),
        },
      })
      .then((response) => setInventory(response.data))
      .catch((error) => console.error("Error fetching inventory:", error));
  }, [handleDelete]);

  return (
    <div className="container">
      <div className="card-header rounded-top-4 bg-gradient ml-0 p-3" style={{ backgroundColor: "#a3dcff" }}>

        <div className="row">
          <div className="col-6">
            <h1 className="px-3">Inventory Items</h1>
          </div>
          <div className="col-6 text-end">

            <Link to={"/inventory/add"} className="btn btn-success">Add Medicine</Link>
          </div>
        </div>
      </div>
      <div className="card-body bg-white shadow p-4">
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Medicine ID</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) =>
              item.medicines.map((medicine) => (
                <tr key={medicine.medicineID}>
                  <td>{medicine.medicineID}</td>
                  <td>{medicine.name}</td>
                  <td>{medicine.quantity}</td>
                  <td>{new Date(medicine.expiryDate).toLocaleDateString()}</td>
                  <td style={{ width: "160px" }} className="text-center">
                  <Link to={`/inventory/update/${medicine.medicineID}`} className="btn btn-primary px-3 mx-2"><i className="bi bi-plus-circle-fill"></i></Link>
                  <button onClick={()=>handleDelete(medicine.medicineID)} className="btn btn-danger px-3 mx-2"><i className="bi bi-trash-fill"></i></button>
                </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetAllInventoryItems;
