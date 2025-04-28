// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router';

// const ManageBeds = () => {
//   // Extract roomName and roomId from URL parameters.
//   const { roomName, roomId } = useParams();
//   const effectiveRoomName = roomName || 'IC_A1';

//   // State for hospitalId (from token), patients, beds, and messages.
//   const [allPatients, setAllPatients] = useState([]);
//   const [beds, setBeds] = useState([]);
//   const [message, setMessage] = useState(null);

//   // Fetch all patients from backend.
//   const fetchPatients = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/patients');
//       setAllPatients(res.data);
//     } catch (err) {
//       console.error('Error fetching patients:', err);
//     }
//   };

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const fetchBeds = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/rooms/${roomId}/beds`);
//       // Expect each bed record to include: bedId, patientId, patientName (if stored), and status.
//       const fetchedBeds = res.data.map((bed, index) => ({
//         index: index + 1,
//         bedId: bed.bedId,
//         patientName: bed.patientName || '',
//         patientId: bed.patientId || '',
//         occupied: bed.status === 'Occupied',
//         showDropdown: false,
//         dropdownMatches: [],
//       }));
//       setBeds(fetchedBeds);
//     } catch (err) {
//       console.error('Error fetching beds:', err);
//       setMessage(err.response?.data?.msg || 'Error fetching beds');
//     }
//   };

//   useEffect(() => {
//     if (roomId) fetchBeds();
//   }, [roomId]);
//   console.log(beds)

//   // When the user types in the patient name input, filter the allPatients list.
//   const handlePatientNameChange = (bedId, value) => {
//     setBeds(prev =>
//       prev.map(bed => {
//         if (bed.bedId === bedId) {
//           if (bed.occupied) return bed; // Do nothing if already occupied.
//           // Filter available patients (already filtered by backend) by username.
//           const matches = value.length > 0
//             ? allPatients.filter(p =>
//                 p.username.toLowerCase().includes(value.toLowerCase())
//               ).slice(0, 5)
//             : [];
//           return { ...bed, patientName: value, showDropdown: value.length > 0, dropdownMatches: matches };
//         }
//         return bed;
//       })
//     );
//   };

//   // When a patient is selected from the dropdown, immediately call the assign API.
//   const handleSelectPatient = async (bedId, patient) => {
//     try {
//       await axios.put(`http://localhost:5000/api/rooms/beds/${bedId}/assign`, { patientId: patient.patientId });
//       setMessage('Bed assigned successfully.');
//       fetchBeds();
//       // After assignment, refresh the patients list to remove the newly assigned patient.
//       fetchPatients();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.msg || 'Error assigning bed');
//     }
//   };

//   // Discharge a bed: call the discharge API.
//   const dischargeBed = async (bed) => {
//     try {
//       await axios.put(`http://localhost:5000/api/rooms/beds/${bed.bedId}/discharge`);
//       setMessage('Bed discharged successfully.');
//       fetchBeds();
//       // Refresh the patients list to include the discharged patient.
//       fetchPatients();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.msg || 'Error discharging bed');
//     }
//   };

//   // Optional: show bed details.
//   const handleDetails = (bed) => {
//     alert(`Bed Details:
// Bed ID: ${bed.bedId}
// Patient Name: ${bed.patientName}
// Patient ID: ${bed.patientId}`);
//   };

//   return (
//     <div className="container mt-4">
//       <div className="card-header rounded-top-4 bg-gradient ml-0 p-3" style={{ backgroundColor: "#a3dcff" }}>
//         <div className="row">
//           <div className="col-6">
//             <h1 className="px-3">Manage Beds for Room {effectiveRoomName}</h1>
//           </div>
//           <div className="col-6 text-end">
//             {/* Additional header controls can go here */}
//           </div>
//         </div>
//       </div>
//       <div className="card-body bg-white shadow p-4">
//         {message && <div className="mb-3" style={{ color: 'green' }}>{message}</div>}
//         <div className="table-responsive">
//           <table className="table table-striped align-middle">
//             <thead>
//               <tr>
//                 <th>Bed ID</th>
//                 <th>Patient Name</th>
//                 <th>Patient ID</th>
//                 <th className="text-end">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {beds.length > 0 ? (
//                 beds.map(bed => (
//                   <tr key={bed.bedId}>
//                     <td>{bed.bedId}</td>
//                     <td style={{ position: 'relative' }}>
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Enter patient name"
//                         value={bed.patientName}
//                         onChange={(e) => handlePatientNameChange(bed.bedId, e.target.value)}
//                         disabled={bed.occupied} // disable if already occupied.
//                       />
//                       {!bed.occupied && bed.showDropdown && bed.dropdownMatches.length > 0 && (
//                         <ul className="list-group position-absolute w-100" style={{ zIndex: 10 }}>
//                           {bed.dropdownMatches.map(match => (
//                             <li
//                               key={match.patientId}
//                               className="list-group-item list-group-item-action"
//                               style={{ cursor: 'pointer' }}
//                               onClick={() => handleSelectPatient(bed.bedId, match)}
//                             >
//                               {match.username} ({match.email})
//                             </li>
//                           ))}
//                         </ul>
//                       )}
//                     </td>
//                     <td>{bed.patientId}</td>
//                     <td className="text-end">
//                       {bed.occupied ? (
//                         <button className="btn btn-sm btn-danger" onClick={() => dischargeBed(bed)}>
//                           Discharge
//                         </button>
//                       ) : (
//                         <span className="text-muted">Not Assigned</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="text-center">No beds available.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageBeds;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';

const ManageBeds = () => {
  const { roomName, roomId } = useParams();
  const effectiveRoomName = roomName || 'IC_A1';

  const [allPatients, setAllPatients] = useState([]);
  const [beds, setBeds] = useState([]);
  const [message, setMessage] = useState(null);

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

  const handlePatientNameChange = (bedId, value) => {
    setBeds(prev =>
      prev.map(bed => {
        if (bed.bedId === bedId && !bed.occupied) {
          const matches = value.length > 0
            ? allPatients.filter(p =>
                p.name.toLowerCase().includes(value.toLowerCase())
              ).slice(0, 5)
            : [];
          return { ...bed, patientName: value, showDropdown: value.length > 0, dropdownMatches: matches };
        }
        return bed;
      })
    );
  };

  const handleSelectPatient = async (bedId, patient) => {
    try {
      await axios.put(`http://localhost:5000/api/rooms/beds/${bedId}/assign`, { patientId: patient.patientDataId });
      setMessage('Bed assigned successfully.');
      fetchBeds();
      fetchPatients();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Error assigning bed');
    }
  };

  const dischargeBed = async (bed) => {
    try {
      await axios.put(`http://localhost:5000/api/rooms/beds/${bed.bedId}/discharge`);
      setMessage('Bed discharged successfully.');
      fetchBeds();
      fetchPatients();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Error discharging bed');
    }
  };

  return (
    <div className=" p-6">
      <div className="bg-indigo-600 p-5 rounded-t-lg shadow-md">
        <h1 className="text-2xl font-semibold ">Manage Beds for Room {effectiveRoomName}</h1>
      </div>

      <div className="bg-white p-6 shadow-md border border-gray-200 rounded-b-lg">
        {message && (
          <div className="mb-4 text-green-600 font-medium">{message}</div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100 text-left text-gray-700 text-sm uppercase font-semibold">
              <tr>
                <th className="p-3 border-b">Bed ID</th>
                <th className="p-3 border-b">Patient Search</th>
                <th className="p-3 border-b">Patient Name</th>
                <th className="p-3 border-b text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {beds.length > 0 ? (
                beds.map(bed => (
                  <tr key={bed.bedId} className="border-b hover:bg-gray-50">
                    <td className="p-3">{bed.bedId}</td>
                    <td className="p-3 relative">
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                        placeholder="Enter patient name"
                        value={bed.patientName}
                        onChange={(e) => handlePatientNameChange(bed.bedId, e.target.value)}
                        disabled={bed.occupied}
                      />
                      {!bed.occupied && bed.showDropdown && bed.dropdownMatches.length > 0 && (
                        <ul className="absolute z-10 bg-white shadow-lg rounded w-full mt-1 border max-h-40 overflow-y-auto">
                          {bed.dropdownMatches.map(match => (
                            <li
                              key={match.patientDataId}
                              onClick={() => handleSelectPatient(bed.bedId, match)}
                              className="px-4 py-2 cursor-pointer hover:bg-emerald-100"
                            >
                              {match.name} ({match.contactInfo})
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="p-3">{bed.patientName} ({ bed.patientId})</td> 
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
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No beds available.
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
