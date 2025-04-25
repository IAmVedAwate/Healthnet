import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

const DeleteFromQueue = () => {
  const [queueEntries, setQueueEntries] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/queues/all/${localStorage.getItem("hospitalId")}`, {
        headers: { "access-token": localStorage.getItem("token") },
      })
      .then((res) => setQueueEntries(res.data))
      .catch((error) => console.error("Error fetching queue entries:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedQueue) {
      alert("Please select a queue entry to delete");
      return;
    }
    axios
      .delete(`http://localhost:5000/api/queues/${selectedQueue}`, {
        headers: { "access-token": localStorage.getItem("token") },
      })
      .then(() => {
        alert("Patient removed from the queue!");
        // Refresh queue entries
        axios
          .get(`http://localhost:5000/api/queues/all/${localStorage.getItem("hospitalId")}`, {
            headers: { "access-token": localStorage.getItem("token") },
          })
          .then((res) => setQueueEntries(res.data))
          .catch((error) => console.error(error));
      })
      .catch((error) => {
        console.error("Error deleting queue entry:", error);
        alert("Error deleting queue entry");
      });
  };

  return (
    <div className="container mt-4">
      <h2>Delete Patient from Queue</h2>
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
                {entry.name} - {entry.status}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button type="submit" variant="danger">
          Delete from Queue
        </Button>
      </Form>
    </div>
  );
};

export default DeleteFromQueue;
