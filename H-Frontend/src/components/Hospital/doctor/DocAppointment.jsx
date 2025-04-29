import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const urgencyOptions = ['0', '1', '2', '3', '4', '5'];

const DocAppointment = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedUrgency, setSelectedUrgency] = useState({});
  const [showUrgencyBox, setShowUrgencyBox] = useState(null);
  const { id: hospitalId } = useSelector((state) => state.auth);

  const fetchMyAppointments = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/get_queue`, {
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
      await axios.post(`http://localhost:5000/api/doctors/urgency`, {
        appointmentId,
        urgency: selectedUrgency[appointmentId],
      });

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.appointmentId === appointmentId
            ? { ...apt, urgency: selectedUrgency[appointmentId] }
            : apt
        )
      );

      toast.success('Urgency updated successfully');
        setShowUrgencyBox(null);
        fetchMyAppointments();
    } catch (err) {
      console.error('Failed to update urgency:', err);
      toast.error('Error updating urgency');
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
                      {urgencyOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
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
                  <button
                    onClick={() => setShowUrgencyBox(apt.appointmentId)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Assign Urgency
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        :
        <h1>No Appointments</h1>
      }
      
    </div>
  );
};

export default DocAppointment;
