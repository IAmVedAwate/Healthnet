import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AddDoctor = () => {
  const navigate = useNavigate();
  const [hospitalId, setHospitalId] = useState(localStorage.getItem("hospitalId"));
  const [departments, setDepartments] = useState([]);
  
  // Fetch departments for the hospital.
  useEffect(() => {
    if (hospitalId) {
      axios
        .get(`http://localhost:5000/api/hospitals/hospital/${hospitalId}`, {
          headers: { "access-token": localStorage.getItem("token") },
        })
        .then((response) => setDepartments(response.data))
        .catch((error) => console.error("Error fetching departments:", error));
    }
  }, [hospitalId]);
  
  // Initialize form data including new authPin
  const [formData, setFormData] = useState({
    departmentId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    specialization: "",
    qualification: "",
    experience: "",
    hospitalId: "",
    authPin: ""  // new field for authentication PIN
  });
  
  // Update formData with hospitalId.
  useEffect(() => {
    if (hospitalId) {
      setFormData((prev) => ({ ...prev, hospitalId }));
    }
  }, [hospitalId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Adjust endpoint as needed; here we're assuming POST /api/doctors/add
      await axios.post("http://localhost:5000/api/doctors/add", formData, {
        headers: { "access-token": localStorage.getItem("token") },
      });
      alert("Doctor added successfully");
      navigate("/doctor/get");
    } catch (error) {
      console.error(error);
      alert("Error adding doctor");
    }
  };
  
  return (
    <div className="container mt-4">
      <div className="card-header rounded-top-4 bg-gradient ml-0 p-3" style={{ backgroundColor: "#a3ffcb" }}>
        <h1>Add Doctor Details</h1>
      </div>
      <div className="card-body shadow p-4">
        <form className="mx-5" onSubmit={handleSubmit}>
          {/* Department Dropdown */}
          <div className="mb-3">
            <label className="form-label">Department</label>
            <select
              className="form-select"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.departmentId} value={dept.departmentId}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          {/* First Name */}
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              onChange={handleChange}
              required
            />
          </div>
          {/* Last Name */}
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              onChange={handleChange}
              required
            />
          </div>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              onChange={handleChange}
              required
            />
          </div>
          {/* Phone Number */}
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              name="phoneNumber"
              onChange={handleChange}
              required
            />
          </div>
          {/* Specialization */}
          <div className="mb-3">
            <label className="form-label">Specialization</label>
            <select
              className="form-select"
              name="specialization"
              onChange={handleChange}
              value={formData.specialization}
              required
            >
              <option value="">Select Specialization</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="General Surgeon">General Surgeon</option>
              <option value="Psychiatrist">Psychiatrist</option>
              <option value="Dentist">Dentist</option>
              <option value="Gynecologist">Gynecologist</option>
            </select>
          </div>
          {/* Qualification */}
          <div className="mb-3">
            <label className="form-label">Qualification</label>
            <input
              type="text"
              className="form-control"
              name="qualification"
              onChange={handleChange}
              required
            />
          </div>
          {/* Experience */}
          <div className="mb-3">
            <label className="form-label">Experience (years)</label>
            <input
              type="number"
              className="form-control"
              name="experience"
              onChange={handleChange}
              required
            />
          </div>
          {/* Authentication PIN */}
          <div className="mb-3">
            <label className="form-label">Authentication PIN</label>
            <input
              type="text"
              className="form-control"
              name="authPin"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <Link to={"/doctor/get"} className="mx-5 btn btn-outline-primary">
            Go Back
          </Link>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
