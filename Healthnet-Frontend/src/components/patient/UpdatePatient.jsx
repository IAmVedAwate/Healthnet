import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdatePatient = () => {
  const { token } = useSelector((state) => state.auth)
  const {patientid} = useParams();
  const [updatedData, setUpdatedData] = useState({
    name: "",
    age: "",
    gender: "Male",
    contactInfo: "",
    doctorId: "",
    status: "Pending",
    hospitalId: "d6224e00-b9fa-4cce-b3a8-6ae76df3c030"

  });
const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  useEffect(() => {
    const fetchEditable = () => {
      axios
        .get(`http://localhost:5000/api/patients/byId/${patientid}`, {
          headers: {
            "access-token": token,
          },
        })
        .then((response) => {
          setUpdatedData({
            name: response.data.name,
            age: response.data.age,
            gender: response.data.gender,
            contactInfo: response.data.contactInfo,
            doctorId: response.data.doctorId,
            status: response.data.status,
            hospitalId: response.data.hospitalId
          });
        })
        .catch((error) => console.error("Error fetching patient:", error));
    };
    fetchEditable();
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/patients/${patientid}`, updatedData,{
        headers: {
          'access-token': token,
        },
      })
      .then(() => alert("Patient updated successfully"))
      .catch((error) => console.error("Error updating patient:", error));
    navigate("/patient/get");
  };

  return (
    <div className="container">
      <div
        className="card-header rounded-top-4 bg-gradient ml-0 p-3"
        style={{ backgroundColor: '#a3ffcb' }}
      >
        <h1>Update Patient</h1>
      </div>
      <div className="card-body shadow p-4">
      
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            defaultValue={updatedData.name}
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Age</label>
          <input
            type="number"
            name="age"
            defaultValue={updatedData.age}
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Gender</label>
          <select
            name="gender"
            defaultValue={updatedData.gender}
            className="form-select"
            onChange={handleChange}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Contact Info</label>
          <input
            type="text"
            name="contactInfo"
            defaultValue={updatedData.contactInfo}
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Assigned Doctor</label>
          <input
            type="text"
            name="doctorId"
            defaultValue={updatedData.doctorId}
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Status</label>
          <select
            name="status"
            defaultValue={updatedData.status}
            className="form-select"
            onChange={handleChange}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Under Treatment">Under Treatment</option>
            <option value="Discharged">Discharged</option>
          </select>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-success">
            Update
          </button>
          <Link to={"/patient/get"} className="mx-5 btn btn-outline-warning">Go Back</Link>

        </div>
      </form>
      </div>
    </div>
  );
};

export default UpdatePatient;
