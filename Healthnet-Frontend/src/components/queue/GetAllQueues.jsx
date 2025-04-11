import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";

const GetAllQueues = () => {
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/queues/${localStorage.getItem("hospitalId")}`, {
        headers: { "access-token": localStorage.getItem("token") },
      })
      .then((response) => setQueues(response.data))
      .catch((error) => console.error("Error fetching queues:", error));
  }, []);

  return (
    <div className="container mt-4">
      <h2>All Queues</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Queue ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {queues.map((queue) => (
            <tr key={queue.queueId}>
              <td>{queue.queueId}</td>
              <td>{queue.name}</td>
              <td>{queue.department || "N/A"}</td>
              <td>{queue.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default GetAllQueues;
