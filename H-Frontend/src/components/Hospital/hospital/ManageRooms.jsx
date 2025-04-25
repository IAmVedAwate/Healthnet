import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

const ManageRooms = () => {
  const { token, id, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    roomName: '',
    roomType: 'ICU',
    description: '',
    bedCount: 0,
    hospitalId: id,
  });

  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const nameInputRef = useRef(null);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rooms');
      setRooms(res.data);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error fetching rooms');
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'bedCount' ? Number(value) : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      if (editingRoom) {
        const res = await axios.put(`http://localhost:5000/api/rooms/${editingRoom}`, formData);
        setMessage(res.data.msg);
      } else {
        const res = await axios.post('http://localhost:5000/api/rooms', formData);
        setMessage(res.data.msg);
      }

      setFormData({
        roomName: '',
        roomType: 'ICU',
        description: '',
        bedCount: 0,
        hospitalId: id,
      });
      setEditingRoom(null);
      fetchRooms();
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Server error');
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room.roomId);
    setFormData({
      roomName: room.roomName,
      roomType: room.roomType,
      description: room.description,
      bedCount: room.totalBeds || room.unoccupiedBeds,
      hospitalId: room.hospitalId,
    });
    nameInputRef.current?.focus();
  };

  const handleDelete = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/rooms/${roomId}`);
        setMessage(res.data.msg);
        fetchRooms();
      } catch (err) {
        setMessage(err.response?.data?.msg || 'Server error');
      }
    }
  };

  const handleDetails = (roomName, roomId) => {
    navigate(`/room/edit/${roomName}/${roomId}`);
  };

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <div className="rounded-t-xl bg-indigo-600 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold ">Manage Rooms</h1>
      </div>

      <div className="bg-white shadow rounded-b-xl p-6">
        {message && <p className="text-red-600 mb-4 font-medium">{message}</p>}

        <form onSubmit={onSubmit} className="space-y-4 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="roomType" className="block text-sm font-medium text-slate-700">
                Room Type
              </label>
              <select
                id="roomType"
                name="roomType"
                value={formData.roomType}
                onChange={onChange}
                required
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="ICU">ICU</option>
                <option value="Ward">Ward</option>
              </select>
            </div>

            <div>
              <label htmlFor="roomName" className="block text-sm font-medium text-slate-700">
                Room Name
              </label>
              <input
                ref={nameInputRef}
                type="text"
                id="roomName"
                name="roomName"
                value={formData.roomName}
                onChange={onChange}
                required
                placeholder="Enter room name"
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div>
              <label htmlFor="bedCount" className="block text-sm font-medium text-slate-700">
                Total Beds
              </label>
              <input
                type="number"
                id="bedCount"
                name="bedCount"
                value={formData.bedCount}
                onChange={onChange}
                required
                min={0}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={onChange}
                placeholder="Optional"
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          <div className="text-end">
            <button
              type="submit"
              className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 transition"
            >
              {editingRoom ? 'Update Room' : 'Add Room'}
            </button>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200 rounded-md">
            <thead className="bg-indigo-600 font-semibold">
              <tr>
                <th className="px-4 py-3">Room Name</th>
                <th className="px-4 py-3">Room Type</th>
                <th className="px-4 py-3 text-center">Unoccupied Beds</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <tr key={room.roomId} className="border-t border-gray-200">
                    <td className="px-4 py-3">{room.roomName}</td>
                    <td className="px-4 py-3">{room.roomType}</td>
                    <td className="px-4 py-3 text-center">{room.unoccupiedBeds}</td>
                    <td className="px-4 py-3">{room.description}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                    <div className="flex items-center gap-2">
  <button
    onClick={() => handleEdit(room)}
    className="flex items-center gap-1 px-3 py-1 rounded-md text-yellow-700 border border-yellow-400 hover:bg-yellow-50 transition"
  >
    ✏️ <span>Edit</span>
  </button>

  <button
    onClick={() => handleDelete(room.roomId)}
    className="flex items-center gap-1 px-3 py-1 rounded-md text-red-700 border border-red-400 hover:bg-red-50 transition"
  >
    🗑️ <span>Delete</span>
  </button>

  <button
    onClick={() => handleDetails(room.roomName, room.roomId)}
    className="flex items-center gap-1 px-3 py-1 rounded-md text-blue-700 border border-blue-400 hover:bg-blue-50 transition"
  >
    🔍 <span>Details</span>
  </button>
</div>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-slate-500">
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
