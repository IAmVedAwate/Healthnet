import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdateBed = () => {
  const { bedid } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [bedData, setBedData] = useState({ ward: "", type: "", status: "" });
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

  useEffect(() => {
    const fetchEditable = () => {
      axios
      .get(`http://localhost:5000/api/beds/${bedid}`)
        .then((response) => {
          setBedData({
            ward: response.data.ward,
            type: response.data.type,
            status: response.data.status,
          })
        })
        .catch((error) => console.error("Error fetching beds:", error));

    }
    fetchEditable();
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/beds/${bedid}`, bedData,{
        headers: {
          'access-token': token,
        },
      })
      .then(() => alert("Bed updated successfully"))
      .catch((error) => console.error("Error updating bed:", error));
    navigate("/bed/get");
  };

  return (
    <div className="container mt-4">
      <div
    className="card-header rounded-top-4 bg-gradient ml-0 p-3"
    style={{ backgroundColor: '#a3ffcb' }}
  >
    <h1>Update Bed</h1>
  </div>
  <div className="card-body shadow p-4">
      <form className="mx-5" onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <label className="mb-2">Ward: </label>
            <select type="text"
              name="ward"
              value={bedData.ward}
              className="form-select"
              placeholder="Ward"
              onChange={handleChange}
              required
            >
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
              value={bedData.type}
              className="form-select"
              placeholder="Type"
              onChange={handleChange}
              required
            >
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
              value={bedData.status}
              className="form-select"
              placeholder="Status"
              onChange={handleChange}
              required
            >
                {statusOptions.map((option) => (
                <option key={`targetAudienceId${option.id}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-warning">Update Bed</button>
        <Link to={"/bed/get"} className="mx-5 btn btn-outline-warning">Go Back</Link>

      </form>
  </div>

    </div>
  );
};

export default UpdateBed;
