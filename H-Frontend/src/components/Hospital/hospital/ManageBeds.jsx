import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

const ManageBeds = () => {
  const { roomName, roomId } = useParams();
  const effectiveRoomName = roomName || 'Unnamed Room';

  const { id: hospitalId } = useSelector((state) => state.auth);
  const [allPatients, setAllPatients] = useState([]);
  const [beds, setBeds] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/patients/all', {
          params: { hospitalId }
        });
        setAllPatients(res.data);
      } catch (err) {
        console.error('Error fetching patients:', err);
      }
    };

    fetchPatients();
  }, [hospitalId]);

  const fetchBeds = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/rooms/${roomId}/beds`);
      const formattedBeds = res.data.map((bed, index) => ({
        index: index + 1,
        bedId: bed.bedId,
        patientName: bed.patientName || '',
        patientId: bed.patientId || '',
        occupied: bed.status === 'Occupied',
        showDropdown: false,
        dropdownMatches: [],
      }));
      setBeds(formattedBeds);
    } catch (err) {
      console.error('Error fetching beds:', err);
      setMessage(err.response?.data?.msg || 'Error loading beds.');
    }
  };

  useEffect(() => {
    if (roomId) fetchBeds();
  }, [roomId]);

  const handlePatientNameChange = (bedId, value) => {
    setBeds((prev) =>
      prev.map((bed) => {
        if (bed.bedId === bedId && !bed.occupied) {
          const matches = value.length > 0
            ? allPatients.filter((p) =>
                p.name.toLowerCase().includes(value.toLowerCase())
              ).slice(0, 5)
            : [];
          return {
            ...bed,
            patientName: value,
            showDropdown: value.length > 0,
            dropdownMatches: matches,
          };
        }
        return bed;
      })
    );
  };

  const handleSelectPatient = async (bedId, patient) => {
    try {
      await axios.put(`http://localhost:5000/api/rooms/beds/${bedId}/assign`, {
        patientId: patient.patientDataId,
      });
      setMessage('✅ Patient assigned to bed.');
      fetchBeds();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Error assigning patient.');
    }
  };

  const dischargeBed = async (bed) => {
    try {
      await axios.put(`http://localhost:5000/api/rooms/beds/${bed.bedId}/discharge`);
      setMessage('🛏️ Bed discharged successfully.');
      fetchBeds();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Error discharging bed.');
    }
  };

  return (
    <div className="p-6">
      <div className="bg-indigo-700 text-white p-5 rounded-t-lg shadow-md">
        <h1 className="text-2xl font-semibold">Manage Beds for Room: {effectiveRoomName}</h1>
      </div>

      <div className="bg-white p-6 shadow-md border border-gray-200 rounded-b-lg">
        {message && <div className="mb-4 text-emerald-700 font-medium">{message}</div>}

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100 text-left text-gray-700 text-sm uppercase font-semibold">
              <tr>
                <th className="p-3 border-b">#</th>
                <th className="p-3 border-b">Bed ID</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Assign Patient</th>
                <th className="p-3 border-b">Current Patient</th>
                <th className="p-3 border-b text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {beds.length > 0 ? (
                beds.map((bed) => (
                  <tr key={bed.bedId} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-700">{bed.index}</td>
                    <td className="p-3 font-medium">{bed.bedId}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          bed.occupied
                            ? 'bg-red-100 text-red-600'
                            : 'bg-green-100 text-green-600'
                        }`}
                      >
                        {bed.occupied ? 'Occupied' : 'Unoccupied'}
                      </span>
                    </td>
                    <td className="p-3 relative w-64">
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                        placeholder="Search patient"
                        value={bed.patientName}
                        onChange={(e) =>
                          handlePatientNameChange(bed.bedId, e.target.value)
                        }
                        disabled={bed.occupied}
                      />
                      {!bed.occupied && bed.showDropdown && (
                        <ul className="absolute z-10 bg-white shadow-lg rounded w-full mt-1 border max-h-40 overflow-y-auto">
                          {bed.dropdownMatches.length > 0 ? (
                            bed.dropdownMatches.map((match) => (
                              <li
                                key={match.patientDataId}
                                onClick={() =>
                                  handleSelectPatient(bed.bedId, match)
                                }
                                className="px-4 py-2 cursor-pointer hover:bg-emerald-100"
                              >
                                {match.name} — {match.contactInfo}
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-2 text-gray-400 text-sm">No matches found</li>
                          )}
                        </ul>
                      )}
                    </td>
                    <td className="p-3">{bed.occupied ? bed.patientName : '—'}</td>
                    <td className="p-3 text-right">
                      {bed.occupied ? (
                        <button
                          onClick={() => dischargeBed(bed)}
                          className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                        >
                          Discharge
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">Not Assigned</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No beds found in this room.
                  </td>
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
