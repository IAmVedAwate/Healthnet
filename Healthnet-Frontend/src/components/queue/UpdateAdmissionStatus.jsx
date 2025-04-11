import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

const UpdateAdmissionStatus = () => {
  const [formData, setFormData] = useState({
    patientID: "",
    admissionStatus: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/queues/admission-status`, formData)
      .then(() => alert("Admission status updated!"))
      .catch((error) => console.error("Error updating admission status:", error));
  };

  return (
    <div className="container mt-4">
      <h2>Update Admission Status</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="patientID" className="mb-3">
          <Form.Label>Patient ID</Form.Label>
          <Form.Control
            type="text"
            name="patientID"
            value={formData.patientID}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="admissionStatus" className="mb-3">
          <Form.Label>Admission Status</Form.Label>
          <Form.Control
            type="text"
            name="admissionStatus"
            value={formData.admissionStatus}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Update Status
        </Button>
      </Form>
    </div>
  );
};

export default UpdateAdmissionStatus;
