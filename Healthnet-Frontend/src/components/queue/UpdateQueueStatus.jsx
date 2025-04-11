import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

const UpdateQueueStatus = () => {
  const [hospitalId, setHospitalId] = useState(localStorage.getItem("hospitalId"));
  const [queueEntries, setQueueEntries] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (hospitalId) {
      axios
        .get(`http://localhost:5000/api/queues/hospital/${hospitalId}`, {
          headers: { "access-token": localStorage.getItem("token") },
        })
        .then((res) => setQueueEntries(res.data))
        .catch((err) => console.error("Error fetching queue entries:", err));
    }
  }, [hospitalId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedQueue || !status) {
      alert("Please select a queue entry and a status");
      return;
    }
    axios
      .put(
        `http://localhost:5000/api/queues/${selectedQueue}`,
        { status },
        {
          headers: { "access-token": localStorage.getItem("token") },
        }
      )
      .then(() => alert("Queue status updated!"))
      .catch((error) => console.error("Error updating queue status:", error));
  };

  return (
    <div className="container mt-4">
      <h2>Update Queue Status</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="queueEntry" className="mb-3">
          <Form.Label>Select Queue Entry</Form.Label>
          <Form.Select
            value={selectedQueue}
            onChange={(e) => setSelectedQueue(e.target.value)}
            required
          >
            <option value="">Select an entry</option>
            {queueEntries.map((entry) => (
              <option key={entry.queueId} value={entry.queueId}>
                {entry.name} (Status: {entry.status})
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="status" className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select Status</option>
            <option value="Waiting">Waiting</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Form.Select>
        </Form.Group>
        <Button type="submit" variant="primary">
          Update Status
        </Button>
      </Form>
    </div>
  );
};

export default UpdateQueueStatus;
