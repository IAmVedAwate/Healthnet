import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { useSelector } from "react-redux";

const GetAllBeds = () => {
  const [beds, setBeds] = useState([]);
  const {token } = useSelector((state) =>state.auth)
  const handleDelete = (bedID) => {
    axios
      .delete(`http://localhost:5000/api/beds/${bedID}`,{
        headers: {
          'access-token': token,
        },
      })
      .then(() => alert("Bed deleted successfully"))
      .catch((error) => console.error("Error deleting bed:", error));
  };
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/beds",{
        headers: {
          'access-token': token,
        },
      })
      .then((response) => setBeds(response.data))
      .catch((error) => console.error("Error fetching beds:", error));
  }, [handleDelete]);

  

  return (
    <div className="container mt-4">
      <div className="card-header rounded-top-4 bg-gradient ml-0 p-3" style={{ backgroundColor: "#a3dcff" }}>

        <div className="row">
          <div className="col-6">
            <h1 className="px-3">All Beds</h1>
          </div>
          <div className="col-6 text-end">

            <Link to={"/bed/add"} className="btn btn-success">Add New Bed</Link>
          </div>
        </div>
      </div>
      <div className="card-body bg-white shadow p-4">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Bed ID</th>
              <th>Ward</th>
              <th>Type</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {beds.map((bed) => (
              <tr key={bed.bedID}>
                <td>{bed.bedID}</td>
                <td>{bed.ward}</td>
                <td>{bed.type}</td>
                <td>{bed.status}</td>
                <td style={{ width: "160px" }} className="text-center">
                  <Link to={`/bed/update/${bed.bedID}`} className="btn btn-primary px-3 mx-2"><i className="bi bi-plus-circle-fill"></i></Link>
                  <button onClick={()=>handleDelete(bed.bedID)} className="btn btn-danger px-3 mx-2"><i className="bi bi-trash-fill"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default GetAllBeds;
