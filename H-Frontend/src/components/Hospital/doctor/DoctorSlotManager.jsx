import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Check, X } from 'lucide-react';
import { useParams } from 'react-router';
import DocAppointment from './DocAppointment';

const DoctorSlotManager = () => {
  const { doctorid } = useParams();
  const [slots, setSlots] = useState([]);
  const [doctorAvailable, setDoctorAvailable] = useState(true);
  const [slotError, setSlotError] = useState('');
  const [authVerified, setAuthVerified] = useState(false);
  const [authPin, setAuthPin] = useState('');
  const [newSlot, setNewSlot] = useState({ startTime: '', endTime: '', isActive: 1, editing: false });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (authVerified) fetchSlots();
    fetchDoctorById();
  }, [authVerified, doctorAvailable]);

  const fetchDoctorById = async ()=>{
    try {
        const res = await axios.get(`http://localhost:5000/api/doctors/${doctorid}`);
        const data = res.data;
        setDoctorAvailable(data?.isActive==1);
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
  }
  // Fetch slots with error handling and type checking.
  const fetchSlots = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/doctor/slots?doctorid=${doctorid}`);
      const data = res.data;
      if (Array.isArray(data)) {
        setSlots(data);
      } else {
        console.error('Unexpected slots data:', data);
        setSlots([]);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  // Submit auth PIN to backend for verification.
  const handleAuthSubmit = () => {
    axios
      .post(`http://localhost:5000/api/doctors/auth`, { doctorid, pin: authPin })
      .then((res) => {
        if (res.data?.verified) setAuthVerified(true);
      })
      .catch(() => alert('Invalid PIN'));
  };

  // Add or update a slot.
  const handleSlotSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/doctor/slots/${editId}`, { ...newSlot, doctorId: doctorid });
      } else {
        await axios.post('http://localhost:5000/api/doctor/slots', { ...newSlot, doctorId: doctorid });
      }
      // Clear form and error
      setNewSlot({ startTime: '', endTime: '', isActive: 1, editing: false });
      setEditId(null);
      setSlotError('');
      fetchSlots();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setSlotError(error.response.data.message); // this line catches the backend "Slot overlaps" error
      } else {
        console.error('Error submitting slot:', error);
      }
    }
  };
  

  // Initialize form state for editing an existing slot.
  const handleEditClick = (slot) => {
    setNewSlot({ startTime: slot.startTime, endTime: slot.endTime, isActive: slot.isActive, editing: true });
    setEditId(slot.slotId);
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/doctor/slots/${id}/status`);
      fetchSlots();
    } catch (error) {
      console.error('Error toggling slot status:', error);
    }
  };

  const toggleAvailability = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/doctors/${id}/status`);
      console.log("toggled Availability!")
      setDoctorAvailable(res.data.isActive);
    } catch (error) {
      console.error('Error toggling slot status:', error);
    }
  };

  // Delete a slot.
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/doctor/slots/${id}`);
      fetchSlots();
    } catch (error) {
      console.error('Error deleting slot:', error);
    }
  };
// Render a slot card. Using slot.slotId as the key.
const slotCard = (slot) => (
  <div className="p-3 mb-3 shadow-sm rounded-lg" key={slot.slotId}>
    <div className="flex justify-between items-center">
      <div>
        <strong>{slot.startTime}</strong> : <strong>{slot.endTime}</strong>
      </div>
      {doctorAvailable ? (
        <div className="flex items-center">
          <button
            className={`btn btn-sm ${slot.isActive === 1 ? 'bg-green-500' : 'bg-red-500'} text-white px-3 py-1 rounded-md mr-2`}
            onClick={() => toggleStatus(slot.slotId)}
          >
            {slot.isActive === 1 ? 'Active' : 'Inactive'}
          </button>
          <button
            className="btn btn-outline-primary btn-sm text-blue-500 px-3 py-1 rounded-md mr-2"
            onClick={() => handleEditClick(slot)}
          >
            <Pencil size={16} />
          </button>
          <button
            className="btn btn-outline-danger btn-sm text-red-500 px-3 py-1 rounded-md"
            onClick={() => handleDelete(slot.slotId)}
          >
            Delete
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  </div>
);

return (
  <div className="py-4">
    {/* Modal covering the component until doctor is authenticated */}
    {!authVerified && (
      <div
        className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50"
      >
        <div className="card p-4 shadow-lg rounded-md w-80">
          <h5 className="mb-3 text-center text-lg font-semibold">Enter Auth PIN</h5>
          <input
            type="text"
            className="form-control mb-3 border border-gray-300 rounded-md p-2"
            value={authPin}
            onChange={(e) => setAuthPin(e.target.value)}
            placeholder="Enter PIN"
          />
          <button className="w-full bg-blue-500 text-white py-2 rounded-md" onClick={handleAuthSubmit}>
            Verify
          </button>
        </div>
      </div>
    )}

    {/* Form for adding or editing a slot */}
    <div>
    <div className="flex justify-end">
      {doctorAvailable ? (
        <button
          className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-green-700 transition"
          onClick={() => toggleAvailability(doctorid)}
        >
          Doctor Available
        </button>
      ) : (
        <button
          className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-red-700 transition"
          onClick={() => toggleAvailability(doctorid)}
        >
          Doctor Unavailable
        </button>
      )}
    </div>

    <div className="p-3 mb-4 bg-white shadow-lg rounded-lg ml-6">
      <h5 className="mb-3 text-xl font-semibold">{editId ? 'Edit Slot' : 'Add New Slot'}</h5>
      {slotError && (
        <div className="alert alert-danger p-2 py-1 mb-3 text-red-600 bg-red-100 rounded-md">
          {slotError}
        </div>
      )}
      <div className="flex items-center gap-3">
        <input
          type="time"
          disabled={!doctorAvailable}
          className="form-control border border-gray-300 rounded-md p-2"
          value={newSlot.startTime}
          onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
        />
        <span>:</span>
        <input
          type="time"
          disabled={!doctorAvailable}
          className="form-control border border-gray-300 rounded-md p-2"
          value={newSlot.endTime}
          onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
        />
        {doctorAvailable && (
          <div className="flex">
            <button
              className={`btn ${newSlot.isActive === 1 ? 'bg-green-600' : 'bg-gray-300'} text-white px-4 py-2 rounded-md mr-2`}
              onClick={() => setNewSlot({ ...newSlot, isActive: 1 })}
            >
              Active
            </button>
            <button
              className={`btn ${newSlot.isActive === 0 ? 'bg-red-600' : 'bg-gray-300'} text-white px-4 py-2 rounded-md`}
              onClick={() => setNewSlot({ ...newSlot, isActive: 0 })}
            >
              Inactive
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md ml-3"
              onClick={handleSlotSubmit}
            >
              <Check size={18} />
            </button>
            {editId && (
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-md ml-3"
                onClick={() => {
                  setEditId(null);
                  setNewSlot({ startTime: '', endTime: '', isActive: 1, editing: false });
                  setSlotError('');
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
    </div>

    {/* Rendering slot cards; checking if slots is an array */}
    {Array.isArray(slots) && slots.map((slot) => slotCard(slot))}
    <DocAppointment doctorId={doctorid } />
  </div>
);

};

export default DoctorSlotManager;
