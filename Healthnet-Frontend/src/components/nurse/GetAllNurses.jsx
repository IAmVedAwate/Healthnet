import React, { useEffect, useState } from "react";
import axios from "axios";

const GetAllNurses = () => {
  const [nurses, setNurses] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/nurses/")
      .then((response) => setNurses(response.data))
      .catch((error) => console.error("Error fetching nurses:", error));
  }, []);

  return (
    <div className="container">
      <h2>All Nurses</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Nurse ID</th>
            <th>Name</th>
            <th>Available</th>
            <th>Contact Info</th>
            <th>Hospital</th>
          </tr>
        </thead>
        <tbody>
          {nurses.map((nurse) => (
            <tr key={nurse.nurseID}>
              <td>{nurse.nurseID}</td>
              <td>{nurse.name}</td>
              <td>{nurse.isAvailable ? "Yes" : "No"}</td>
              <td>{nurse.contactInfo}</td>
              <td>{nurse.hospital}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetAllNurses;
