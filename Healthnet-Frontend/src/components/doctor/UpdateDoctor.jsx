import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const UpdateDoctor = () => {
  const { doctorid } = useParams();
  const navigate = useNavigate();
  const [hospitalId, setHospitalId] = useState(localStorage.getItem("hospitalId"));
  const [departments, setDepartments] = useState([]);
  
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
  });
  
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
  
  // Fetch the doctor's details.
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctors/${doctorid}`, {
          headers: { "access-token": localStorage.getItem("token") },
        });
        setFormData({
          departmentId: res.data.departmentId || "",
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          email: res.data.email || "",
          phoneNumber: res.data.phoneNumber || "",
          specialization: res.data.specialization || "",
          qualification: res.data.qualification || "",
          experience: res.data.experience || "",
          hospitalId: res.data.hospitalId || hospitalId,
        });
      } catch (error) {
        console.error("Error fetching doctor:", error);
      }
    };
    fetchDoctor();
  }, [doctorid, hospitalId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/doctors/${doctorid}`, formData, {
        headers: { "access-token": localStorage.getItem("token") },
      });
      alert("Doctor updated successfully");
      navigate("/doctor/get");
    } catch (error) {
      console.error("Error updating doctor:", error);
      alert("Error updating doctor");
    }
  };
  
  return (
    <div className="container mt-4">
      <div
        className="card-header rounded-top-4 bg-gradient ml-0 p-3"
        style={{ backgroundColor: "#a3ffcb" }}
      >
        <h1>Update Doctor Details</h1>
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
              value={formData.firstName}
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
              value={formData.lastName}
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
              value={formData.email}
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
              value={formData.phoneNumber}
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
              value={formData.specialization}
              onChange={handleChange}
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
              value={formData.qualification}
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
              value={formData.experience}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-warning">
            Update
          </button>
          <Link to={"/doctor/get"} className="mx-5 btn btn-outline-warning">
            Go Back
          </Link>
        </form>
      </div>
    </div>
  );
};

export default UpdateDoctor;
