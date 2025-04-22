import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ManageRooms = () => {
  // State for form fields
  const {token , id ,role} = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    roomName: '',
    roomType: 'ICU', // default option: ICU
    description: '',
    bedCount: 0,
    hospitalId: id, // For now, you can preset hospitalId or retrieve it from authenticated context/localStorage
  });
  const navigate = useNavigate();
  
  // State for the list of rooms
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState(null);
  // editingRoom holds the roomId of the room being edited (null if new room)
  const [editingRoom, setEditingRoom] = useState(null);
  // To focus on the roomName input when editing
  const nameInputRef = useRef(null);

  // Fetch rooms from backend on component mount
  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rooms');
      // Expected response: an array of room objects with at least: roomId, roomName, roomType, description, unoccupiedBeds, hospitalId
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || 'Error fetching rooms');
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Handle form field changes
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'bedCount' ? Number(value) : value,
    }));
  };

  // Handle form submission (Add or Update)
  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      if (editingRoom) {
        // Update room: call PUT /api/rooms/:roomId
        const res = await axios.put(`http://localhost:5000/api/rooms/${editingRoom}`, formData);
        setMessage(res.data.msg);
      } else {
        // Create new room: call POST /api/rooms
        const res = await axios.post('http://localhost:5000/api/rooms', formData);
        setMessage(res.data.msg);
      }
      // Reset form and editing state
      setFormData(prev => ({
        ...prev,
        roomName: '',
        roomType: 'ICU',
        description: '',
        bedCount: 0,
      }));
      setEditingRoom(null);
      // Refresh room list
      fetchRooms();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || 'Server error');
    }
  };

  // When Edit is clicked: populate form with that room's data and set editing mode
  const handleEdit = (room) => {
    setEditingRoom(room.roomId);
    setFormData({
      roomName: room.roomName,
      roomType: room.roomType,
      description: room.description,
      // If your GET endpoint returns only unoccupiedBeds, we assume total beds are unoccupied + occupied.
      // For simplicity, we'll assume the user wants to update the total beds to a new number.
      bedCount: room.totalBeds ? room.totalBeds : room.unoccupiedBeds,
      hospitalId: room.hospitalId,
    });
    // Focus on the roomName input
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  };

  // Delete a room and its beds
  const handleDelete = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/rooms/${roomId}`);
        setMessage(res.data.msg);
        fetchRooms();
      } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.msg || 'Server error');
      }
    }
  };

  // Show room details in an alert
  const handleDetails = (roomN, roomI) => {
    navigate(`/room/edit/${roomN}/${roomI}`)
  };

  return (
    <div className="container mt-4">
      <div className="card-header rounded-top-4 bg-gradient ml-0 p-3" style={{ backgroundColor: "#a3dcff" }}>
        <div className="row">
          <div className="col-6">
            <h1 className="px-3">Manage Rooms</h1>
          </div>
          <div className="col-6 text-end">
            {/* Additional header controls can go here */}
          </div>
        </div>
      </div>
      <div className="card-body bg-white shadow p-4">
        {message && (
          <div className="mb-3" style={{ color: 'red' }}>
            {message}
          </div>
        )}
        {/* Horizontal Form */}
        <form onSubmit={onSubmit} className="mb-4">
          <div className="row align-items-end">
            <div className="col-md-3">
              <label htmlFor="roomType" className="form-label">Room Type</label>
              <select
                id="roomType"
                name="roomType"
                className="form-select"
                value={formData.roomType}
                onChange={onChange}
                required
              >
                <option value="ICU">ICU</option>
                <option value="Ward">Ward</option>
              </select>
            </div>
            <div className="col-md-3">
              <label htmlFor="roomName" className="form-label">Room Name</label>
              <input
                type="text"
                id="roomName"
                name="roomName"
                className="form-control"
                value={formData.roomName}
                onChange={onChange}
                placeholder="Enter room name"
                ref={nameInputRef}
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="bedCount" className="form-label">Total Beds</label>
              <input
                type="number"
                id="bedCount"
                name="bedCount"
                className="form-control"
                value={formData.bedCount}
                onChange={onChange}
                placeholder="Number of beds"
                min="0"
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="description" className="form-label">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={onChange}
                placeholder="Enter description"
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col text-end">
              <button type="submit" className="btn btn-primary">
                {editingRoom ? 'Update Room' : 'Add Room'}
              </button>
            </div>
          </div>
        </form>

        {/* Rooms Table */}
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Room Name</th>
                <th>Room Type</th>
                <th className="text-center">Unoccupied Beds</th>
                <th>Description</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <tr key={room.roomId}>
                    <td>{room.roomName}</td>
                    <td>{room.roomType}</td>
                    <td>
                      <p className="mb-0 text-center">{room.unoccupiedBeds}</p>
                    </td>
                    <td>{room.description}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(room)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger me-2" onClick={() => handleDelete(room.roomId)}>
                        Delete
                      </button>
                      <button className="btn btn-sm btn-info" onClick={() => handleDetails(room.roomName, room.roomId)}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No rooms available.
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

export default ManageRooms;
