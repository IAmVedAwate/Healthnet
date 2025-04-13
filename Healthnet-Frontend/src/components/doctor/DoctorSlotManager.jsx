import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Check, X } from 'lucide-react';
import { useParams } from 'react-router-dom';

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
    <div className="card p-3 mb-3 shadow-sm" key={slot.slotId}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <strong>{slot.startTime}</strong> : <strong>{slot.endTime}</strong>
        </div>
        {doctorAvailable ? 
        <div className="d-flex align-items-center">
        <button
          className={`btn btn-sm ${slot.isActive === 1 ? 'btn-success' : 'btn-danger'} me-2`}
          onClick={() => toggleStatus(slot.slotId)}
        >
          {slot.isActive === 1 ? 'Active' : 'Inactive'}
        </button>
        <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEditClick(slot)}>
          <Pencil size={16} />
        </button>
        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(slot.slotId)}>
          Delete
        </button>
      </div>
      :
      <></>}
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      {/* Modal covering the component until doctor is authenticated */}
      {!authVerified && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-white d-flex justify-content-center align-items-center"
          style={{ zIndex: 1050 }}
        >
          <div className="card p-4 shadow" style={{ width: '300px' }}>
            <h5 className="mb-3 text-center">Enter Auth PIN</h5>
            <input
              type="text"
              className="form-control mb-3"
              value={authPin}
              onChange={(e) => setAuthPin(e.target.value)}
              placeholder="Enter PIN"
            />
            <button className="btn btn-primary w-100" onClick={handleAuthSubmit}>
              Verify
            </button>
          </div>
        </div>
      )}

      {/* Form for adding or editing a slot */}
      <div className='d-flex justify-content-end'>
        {doctorAvailable ? <button className='btn btn-outline-success shadow-lg btn-lg my-1' onClick={()=>{toggleAvailability(doctorid)}}>Doctor Available</button>:
                         <button className='btn btn-outline-danger shadow-lg btn-lg my-1' onClick={()=>{toggleAvailability(doctorid)}}>Doctor Unavailable</button>}
      </div>
      
      <div className="card p-3 mb-4">
        <h5 className="mb-3">{editId ? 'Edit Slot' : 'Add New Slot'}</h5>
        {slotError && (
  <div className="alert alert-danger p-2 py-1 mb-3" role="alert">
    {slotError}
  </div>
)}
        <div className="d-flex align-items-center gap-2">
          <input
            type="time"
            disabled={!doctorAvailable}
            className="form-control"
            value={newSlot.startTime}
            onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}  
          />
          <span>:</span>
          <input
            type="time"
            disabled={!doctorAvailable}
            className="form-control"
            value={newSlot.endTime}
            onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}  
          />
          {doctorAvailable? 
          <div className="d-flex">
            <button
              className={`btn me-1 ${newSlot.isActive === 1 ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={() => setNewSlot({ ...newSlot, isActive: 1 })}
            >
              Active
            </button>
            <button
              className={`btn ${newSlot.isActive === 0 ? 'btn-danger' : 'btn-outline-secondary'}`}
              onClick={() => setNewSlot({ ...newSlot, isActive: 0  })}
            >
              Inactive
            </button>
            <button className="btn btn-primary ms-2" onClick={handleSlotSubmit}>
            <Check size={18} />
          </button>
          {editId && (
    <button
      className="btn btn-outline-secondary"
      onClick={() => {
        setEditId(null);
        setNewSlot({ startTime: '', endTime: '', isActive: 1, editing: false });
        setSlotError('');
      }}
    >
      <X size={18} />
    </button>
  )}
          </div>:<></>}
          
          
        </div>
      </div>

      {/* Rendering slot cards; checking if slots is an array */}
      {Array.isArray(slots) &&
        slots.map((slot) => slotCard(slot))
      }
    </div>
  );
};

export default DoctorSlotManager;
