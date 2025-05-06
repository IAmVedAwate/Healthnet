import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MedicalHistoryList from '../patient/MedicalHistory/MedicalHistoryList'; // Adjust the path if needed



const priorityLabels = {
  0: "Critical/Emergency",
  1: "High Priority",
  2: "Moderate Priority",
  3: "Low Priority"
};

const urgencyOptions = Object.entries(priorityLabels); // [["0", "Critical/Emergency"], ...]


const DocAppointment = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedUrgency, setSelectedUrgency] = useState({});
  const [showUrgencyBox, setShowUrgencyBox] = useState(null);
  const { id: hospitalId } = useSelector((state) => state.auth);
  const [viewHistoryFor, setViewHistoryFor] = useState(null);


  const fetchMyAppointments = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/get_pending_queue`, {
        params: { hospitalId }
      });
      const filtered = res.data.filter((apt) => apt.doctorId === doctorId);
      setAppointments(filtered);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      toast.error('Failed to load appointments');
    }
  };

  useEffect(() => {
    

    fetchMyAppointments();
  }, [doctorId, hospitalId]);

  const handleUrgencyChange = async (appointmentId) => {
    try {
      // 1) Update urgency (and implicitly approve)
      await axios.post(`http://localhost:5000/api/doctors/urgency`, {
        appointmentId,
        urgency: selectedUrgency[appointmentId],
      });
  
      // 2) Update local state
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.appointmentId === appointmentId
            ? { ...apt, urgency: selectedUrgency[appointmentId] }
            : apt
        )
      );
  
      // 3) Find the appointment object to get its patientId
      const approvedApt = appointments.find(
        (apt) => apt.appointmentId === appointmentId
      );
      const patientId = approvedApt.patientAssignId;
  
      // 4) Check bed availability
      const roomsRes = await axios.get(
        `http://localhost:5000/api/rooms?hospitalId=${hospitalId}`
      );
      const freeRoom = roomsRes.data.find((r) => r.unoccupiedBeds > 0);
  
      if (!freeRoom) {
        toast.warn('No beds available in this hospital');
      } else {
        // 5) Assign bed
        await axios.put(
          `http://localhost:5000/api/rooms/beds/${freeRoom.availableBedId}/assign`,
          { patientId },
          { headers: { 'Content-Type': 'application/json' } }
        );
        toast.success('Urgency updated and bed assigned successfully');
      }
  
      // 6) Hide the dropdown and refresh list
      setShowUrgencyBox(null);
      fetchMyAppointments();
    } catch (err) {
      console.error('Error in urgency/bed flow:', err);
      toast.error('Failed to update urgency or assign bed');
    }
  };
  

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Appointments for Doctor</h2>
      {appointments.length > 0 ?
        <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 text-sm">
            <th className="border px-4 py-2">Patient ID</th>
            <th className="border px-4 py-2">Arrival Time</th>
            <th className="border px-4 py-2">Cause</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr key={apt.appointmentId} className="text-center">
              <td className="border px-4 py-2">{apt.patientId}</td>
              <td className="border px-4 py-2">
                {new Date(apt.arrivalTime).toLocaleString()}
              </td>
              <td className="border px-4 py-2">{apt.cause}</td>
              <td className="border px-4 py-2">
                {showUrgencyBox === apt.appointmentId ? (
                  <div className="flex items-center gap-2 justify-center">
                    <select
                      value={selectedUrgency[apt.appointmentId] || ''}
                      onChange={(e) =>
                        setSelectedUrgency((prev) => ({
                          ...prev,
                          [apt.appointmentId]: e.target.value,
                        }))
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="" disabled>Select</option>
                      {urgencyOptions.map(([value, label]) => (
  <option key={value} value={value}>
    {label}
  </option>
))}

                    </select>
                    <button
                      onClick={() => handleUrgencyChange(apt.appointmentId)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setShowUrgencyBox(null)}
                      className="text-red-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                    <>
                    <button
                    onClick={() => setShowUrgencyBox(apt.appointmentId)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Assign Urgency
                    </button>
                    <button
                    onClick={() => setViewHistoryFor(apt.patientId)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded ml-2"
                  >
                    View Medical History
                  </button>
                    </>
                  
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        :
        <h1>No Appointments</h1>
      }
      {viewHistoryFor && (
  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
    <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
      <button
        onClick={() => setViewHistoryFor(null)}
        className="absolute top-4 right-4 text-gray-500 hover:text-black"
      >
        ✕
      </button>

      <MedicalHistoryList
        patientId={viewHistoryFor}
        role="hospital"
      />
    </div>
  </div>
)}


    </div>
  );
};

export default DocAppointment;
