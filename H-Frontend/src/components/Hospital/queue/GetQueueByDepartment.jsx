import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Table } from "react-bootstrap";
import jwt_decode from "jwt-decode";

const GetQueueByDepartment = () => {
  const [hospitalId, setHospitalId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setHospitalId(decoded.id);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  useEffect(() => {
    if (hospitalId) {
      axios
        .get(`http://localhost:5000/api/departments/hospital/${hospitalId}`, {
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
      .get(`http://localhost:5000/api/queues/department/${selectedDept}`, {
        headers: { "access-token": localStorage.getItem("token") },
      })
      .then((response) => setQueue(response.data))
      .catch((error) => console.error("Error fetching queue:", error));
  };

  return (
    <div className="container mt-4">
      <h2>Get Queue by Department</h2>
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
          Fetch Queue
        </Button>
      </Form>
      {queue.length > 0 && (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Queue ID</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((entry) => (
              <tr key={entry.queueId}>
                <td>{entry.queueId}</td>
                <td>{entry.name}</td>
                <td>{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default GetQueueByDepartment;
