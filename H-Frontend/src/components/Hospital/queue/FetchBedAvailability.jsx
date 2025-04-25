import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Table } from "react-bootstrap";

const FetchBedAvailability = () => {
  const [hospitalId, setHospitalId] = useState(localStorage.getItem("hospitalId"));
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [beds, setBeds] = useState([]);

  // Fetch departments for this hospital
  useEffect(() => {
    if (hospitalId) {
      axios
        .get(`http://localhost:5000/api/hospitals/hospital/${hospitalId}`, {
          headers: { "access-token": localStorage.getItem("token") },
        })
        .then((res) => setDepartments(res.data))
        .catch((err) => console.error("Error fetching departments:", err));
    }
  }, [hospitalId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDept) {
      alert("Please select a department");
      return;
    }
    axios
      .get(`http://localhost:5000/api/queues/beds/${selectedDept}`, {
        headers: { "access-token": localStorage.getItem("token") },
      })
      .then((response) => setBeds(response.data))
      .catch((error) => console.error("Error fetching bed availability:", error));
  };

  return (
    <div className="container mt-4">
      <h2>Fetch Bed Availability</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="department" className="mb-3">
          <Form.Label>Department</Form.Label>
          <Form.Select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.departmentId} value={dept.departmentId}>
                {dept.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button type="submit" variant="primary">
          Fetch Availability
        </Button>
      </Form>
      {beds.length > 0 && (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Bed Number</th>
              <th>Occupied</th>
            </tr>
          </thead>
          <tbody>
            {beds.map((bed, index) => (
              <tr key={index}>
                <td>{bed.bedNumber || bed.bedId}</td>
                <td>{bed.isOccupied ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default FetchBedAvailability;
