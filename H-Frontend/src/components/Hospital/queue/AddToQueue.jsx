import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

const AddToQueue = () => {
  const { hospitalid } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [queueData, setQueueData] = useState({
    name: "",
    hospital: hospitalid,
    contactNo: "",
    appointmentDate: new Date().toISOString(),
    status: "Pending",
    reason: "",
    notes: "",
    doctorId:"",
    patientId:""
  });

  // Fetch doctors for this hospital
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/doctors/all/${hospitalid}`, {
        headers: { "access-token": localStorage.getItem("token") },
      })
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  }, [hospitalid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQueueData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/queues/add", queueData, {
        headers: { "access-token": localStorage.getItem("token") },
      });
      alert("Patient added to the queue successfully");
      setQueueData((prev) => ({
        ...prev,
        name: "",
        hospital: hospitalid,
        contactNo: "",
        appointmentDate: new Date().toISOString(),
        status: "Pending",
        reason: "wasw",
        notes: "vvvv",
        doctorId:"",
        patientId:"68084f5c-28f3-45af-a7fc-6d705bcfaa2d"
      }));
    } catch (error) {
      console.error("Error adding to queue:", error);
      alert("Error adding to queue");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Optionally, you can include a carousel for doctors here */}
        <div className="col-md-4">
          <h3 className="mb-3">Book Appointment</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name:
              </label>
              <input
                onChange={handleInputChange}
                value={queueData.name}
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="contactNo" className="form-label">
                Contact No:
              </label>
              <input
                onChange={handleInputChange}
                value={queueData.contactNo}
                type="text"
                className="form-control"
                id="contactNo"
                name="contactNo"
                placeholder="Enter your contact number"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="doctor" className="form-label">
                Doctor:
              </label>
              <select
                className="form-select"
                id="doctor"
                name="doctor"
                onChange={handleInputChange}
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.doctorId} value={doctor.doctorId}>
                    {doctor.firstName} {doctor.lastName} - {doctor.specialization} /{" "}
                    {doctor.departmentId}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                Message:
              </label>
              <textarea
                className="form-control"
                onChange={handleInputChange}
                value={queueData.message}
                id="message"
                name="message"
                rows="3"
                placeholder="Any additional information"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddToQueue;
