import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GetAllHospitals = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const {token} = useSelector((state) => state.auth)

  // Navigate to the appointment booking page with the hospitalId.
  const handleNavigation = (hospitalId) => {
    navigate(`/queue/add/${hospitalId}`);
  };

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/hospitals", {
          headers: { "access-token": token },
        });
        setHospitals(response.data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };
    fetchHospitals();
  }, []);

  return (
    <div className="container mt-4">
      <div
        className="card-header rounded-top-4 bg-gradient ml-0 p-3"
        style={{ backgroundColor: "#a3dcff" }}
      >
        <div className="row">
          <div className="col-6">
            <h1 className="px-3">All Hospitals</h1>
          </div>
          <div className="col-6 text-end"></div>
        </div>
      </div>
      <div className="card-body bg-white shadow p-4">
        {hospitals.length > 0 ? (
          hospitals.map((hospital) => (
            <div
              key={hospital.hospitalId}
              className="row align-items-center mb-3"
            >
              <div className="col-md-4 fw-bold">
                {hospital.hospitalName}
              </div>
              <div className="col-md-4">
                People In Queue: <i>{hospital.peopleInQueue}</i>
              </div>
              <div className="col-md-4 text-end">
                <button
                  className="btn btn-primary"
                  onClick={() => handleNavigation(hospital.hospitalId)}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>No hospitals found.</div>
        )}
      </div>
    </div>
  );
};

export default GetAllHospitals;
