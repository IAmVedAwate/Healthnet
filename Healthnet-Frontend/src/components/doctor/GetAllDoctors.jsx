import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const GetAllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  const fetchDoctors = () => {
    const hospitalId = localStorage.getItem("hospitalId");
    axios
      .get(`http://localhost:5000/api/doctors/all/${hospitalId}`, {
        headers: {
          "access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  };

  const handleDelete = (doctorId) => {
    axios
      .delete(`http://localhost:5000/api/doctors/${doctorId}`, {
        headers: {
          "access-token": localStorage.getItem("token"),
        },
      })
      .then(() => {
        alert("Doctor deleted successfully");
        fetchDoctors();
      })
      .catch((error) => console.error(error));
  };

  const handleEnterClick = (doctorId) => {
    navigate(`/doctor/dashboard/${doctorId}`);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="container mt-4">
      <div
        className="card-header rounded-top-4 bg-gradient ml-0 p-3"
        style={{ backgroundColor: "#a3dcff" }}
      >
        <div className="row">
          <div className="col-6">
            <h1 className="px-3">All Doctors</h1>
          </div>
          <div className="col-6 text-end">
            <Link to={"/doctor/add"} className="btn btn-success">
              Add New Doctor
            </Link>
          </div>
        </div>
      </div>
      <div className="card-body bg-white shadow p-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Contact Info</th>
              <th>Hospital</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.doctorId}>
                <td>{doctor.doctorId}</td>
                <td>{doctor.firstName} {doctor.lastName}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.phoneNumber}</td>
                <td>{doctor.hospitalId}</td>
                <td style={{ width: "220px" }} className="text-center">
                  <button
                    onClick={() => handleEnterClick(doctor.doctorId)}
                    className="btn btn-success px-2 mx-2"
                  >
                    Enter
                  </button>
                  <Link
                    to={`/doctor/update/${doctor.doctorId}`}
                    className="btn btn-primary px-3 mx-1"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Link>
                  <button
                    onClick={() => handleDelete(doctor.doctorId)}
                    className="btn btn-danger px-3 mx-1"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetAllDoctors;
