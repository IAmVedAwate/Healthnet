import React from "react";
import axios from "axios";
import { Button } from "react-bootstrap";

const SyncQueueToCityModule = () => {
  const handleSync = () => {
    axios
      .post("http://localhost:5000/api/queues/sync")
      .then((response) => alert("Queue synced to city module successfully!"))
      .catch((error) => console.error("Error syncing queue:", error));
  };

  return (
    <div className="container mt-4">
      <h2>Sync Queue to City Module</h2>
      <Button variant="primary" onClick={handleSync}>
        Sync Now
      </Button>
    </div>
  );
};

export default SyncQueueToCityModule;
