import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ManageBeds = () => {
  // Extract roomName and roomId from URL parameters.
  const { roomName, roomId } = useParams();
  const effectiveRoomName = roomName || 'IC_A1';

  // State for hospitalId (from token), patients, beds, and messages.
  const [allPatients, setAllPatients] = useState([]);
  const [beds, setBeds] = useState([]);
  const [message, setMessage] = useState(null);

  // Fetch all patients from backend.
  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients');
      setAllPatients(res.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchBeds = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/rooms/${roomId}/beds`);
      // Expect each bed record to include: bedId, patientId, patientName (if stored), and status.
      const fetchedBeds = res.data.map((bed, index) => ({
        index: index + 1,
        bedId: bed.bedId,
        patientName: bed.patientName || '',
        patientId: bed.patientId || '',
        occupied: bed.status === 'Occupied',
        showDropdown: false,
        dropdownMatches: [],
      }));
      setBeds(fetchedBeds);
    } catch (err) {
      console.error('Error fetching beds:', err);
      setMessage(err.response?.data?.msg || 'Error fetching beds');
    }
  };

  useEffect(() => {
    if (roomId) fetchBeds();
  }, [roomId]);
  console.log(beds)

  // When the user types in the patient name input, filter the allPatients list.
  const handlePatientNameChange = (bedId, value) => {
    setBeds(prev =>
      prev.map(bed => {
        if (bed.bedId === bedId) {
          if (bed.occupied) return bed; // Do nothing if already occupied.
          // Filter available patients (already filtered by backend) by username.
          const matches = value.length > 0
            ? allPatients.filter(p =>
                p.username.toLowerCase().includes(value.toLowerCase())
              ).slice(0, 5)
            : [];
          return { ...bed, patientName: value, showDropdown: value.length > 0, dropdownMatches: matches };
        }
        return bed;
      })
    );
  };

  // When a patient is selected from the dropdown, immediately call the assign API.
  const handleSelectPatient = async (bedId, patient) => {
    try {
      await axios.put(`http://localhost:5000/api/rooms/beds/${bedId}/assign`, { patientId: patient.patientId });
      setMessage('Bed assigned successfully.');
      fetchBeds();
      // After assignment, refresh the patients list to remove the newly assigned patient.
      fetchPatients();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Error assigning bed');
    }
  };

  // Discharge a bed: call the discharge API.
  const dischargeBed = async (bed) => {
    try {
      await axios.put(`http://localhost:5000/api/rooms/beds/${bed.bedId}/discharge`);
      setMessage('Bed discharged successfully.');
      fetchBeds();
      // Refresh the patients list to include the discharged patient.
      fetchPatients();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Error discharging bed');
    }
  };

  // Optional: show bed details.
  const handleDetails = (bed) => {
    alert(`Bed Details:
Bed ID: ${bed.bedId}
Patient Name: ${bed.patientName}
Patient ID: ${bed.patientId}`);
  };

  return (
    <div className="container mt-4">
      <div className="card-header rounded-top-4 bg-gradient ml-0 p-3" style={{ backgroundColor: "#a3dcff" }}>
        <div className="row">
          <div className="col-6">
            <h1 className="px-3">Manage Beds for Room {effectiveRoomName}</h1>
          </div>
          <div className="col-6 text-end">
            {/* Additional header controls can go here */}
          </div>
        </div>
      </div>
      <div className="card-body bg-white shadow p-4">
        {message && <div className="mb-3" style={{ color: 'green' }}>{message}</div>}
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Bed ID</th>
                <th>Patient Name</th>
                <th>Patient ID</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {beds.length > 0 ? (
                beds.map(bed => (
                  <tr key={bed.bedId}>
                    <td>{bed.bedId}</td>
                    <td style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter patient name"
                        value={bed.patientName}
                        onChange={(e) => handlePatientNameChange(bed.bedId, e.target.value)}
                        disabled={bed.occupied} // disable if already occupied.
                      />
                      {!bed.occupied && bed.showDropdown && bed.dropdownMatches.length > 0 && (
                        <ul className="list-group position-absolute w-100" style={{ zIndex: 10 }}>
                          {bed.dropdownMatches.map(match => (
                            <li
                              key={match.patientId}
                              className="list-group-item list-group-item-action"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleSelectPatient(bed.bedId, match)}
                            >
                              {match.username} ({match.email})
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td>{bed.patientId}</td>
                    <td className="text-end">
                      {bed.occupied ? (
                        <button className="btn btn-sm btn-danger" onClick={() => dischargeBed(bed)}>
                          Discharge
                        </button>
                      ) : (
                        <span className="text-muted">Not Assigned</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No beds available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBeds;
