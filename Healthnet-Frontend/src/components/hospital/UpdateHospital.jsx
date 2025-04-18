import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdateHospital = () => {
  const { token } = useSelector((state) => state.auth)
  const { hospitalid } = useParams();
  const [formData, setFormData] = useState({
    hospitalName: "",
    hospitalLocation: "",
    hospitalContactInfo: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    const fetchEditable = ()=>{
      axios
      .get(`http://localhost:5000/api/hospitals/${hospitalid}`,{
        headers: {
          'access-token': token,
        },
      })
      .then((response) => {
        setFormData({
          hospitalName: response.data.hospitalName,
          hospitalLocation: response.data.hospitalLocation,
          hospitalContactInfo: response.data.hospitalContactInfo,
        })
      })
      .catch((error) => console.error(error));
    }
    fetchEditable();
  }, [])
  

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/hospitals/${hospitalid}`, formData,{
        headers: {
          'access-token': token,
        },
      })
      .then((response) => alert("Hospital updated successfully"))
      .catch((error) => console.error(error));
    navigate("/hospital/get");
  };

  return (
    <div className="container mt-4">
      <div
        className="card-header rounded-top-4 bg-gradient ml-0 p-3"
        style={{ backgroundColor: '#a3ffcb' }}
      >
        <h1>Update Hospital</h1>
      </div>
      <div className="card-body shadow p-4">

        <form className="mx-5" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Hospital Name</label>
            <input
              type="text"
              className="form-control"
              name="hospitalName"
              defaultValue={formData.hospitalName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Hospital Location</label>
            <input
              type="text"
              className="form-control"
              name="hospitalLocation"
              defaultValue={formData.hospitalLocation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Hospital Contact Info</label>
            <input
              type="text"
              className="form-control"
              name="hospitalContactInfo"
              defaultValue={formData.hospitalContactInfo}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Update</button>
          <Link to={"/hospital/get"} className="mx-5 btn btn-outline-warning">Go Back</Link>

        </form>
      </div>
    </div>
  );
};

export default UpdateHospital;
