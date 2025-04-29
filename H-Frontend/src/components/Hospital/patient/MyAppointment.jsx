import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  CalendarDays,
  Clock,
  Stethoscope,
  XCircle
} from 'lucide-react';

import { Link, useNavigate } from 'react-router';

const DoctorModal = ({ doctor, onClose }) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm *: flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          <XCircle size={24} />
        </button>
        <h3 className="text-2xl font-bold text-blue-700 mb-2">Dr. {doctor.doctorFirstName} {doctor.doctorLastName}</h3>
        <p className="text-gray-700 mb-1"><span className="font-medium">Specialization:</span> {doctor.specialization}</p>
        <p className="text-gray-700 mb-1"><span className="font-medium">Email:</span> {doctor.doctorEmail}</p>
        <p className="text-gray-700"><span className="font-medium">Phone:</span> {doctor.doctorPhone}</p>
      </div>
    </div>
  );
};

const MyAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
    const { id } = useSelector((state) => state.auth);
    
    const navigate = useNavigate()

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/patients/myAppointment`, {
          params: { id },
        });
        setAppointments(res.data);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
      }
    };

    if (id) fetchAppointments();
  }, [id]);

  if (!appointments.length) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No appointments found.
      </div>
    );
  }

  return (
    <>
          <div className='p-6'>
              <div className='flex justify-between'>
                  <h1 className="text-3xl font-bold  m-10 text-teal-600">My Appointments</h1>
                  <div>
                  <button
      onClick={() => navigate(-1)}
      className="bg-blue-600 p-2 rounded-2xl text-white hover:scale-110 transition"
    >
      Back
    </button>
                  </div>
          </div>
          <div className="grid gap-6 p-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {appointments.map((appt) => (
          <div
            key={appt.appointmentId}
            className="bg-white shadow-md rounded-2xl p-5 border hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-2 text-gray-700 mb-1">
              <CalendarDays size={18} />
              <span className="font-medium">Booked On:</span> {appt.appointmentDate}
            </div>

            <div className="flex items-center gap-2 text-gray-700 mb-1">
              <Clock size={18} />
              <span className="font-medium">Arrival Time:</span>{' '}
              {new Date(appt.arrivalTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>

                <div className='flex justify-between'>
                <div>
                <div className="text-sm mt-3 text-gray-600">
              <span className="font-medium">Status:</span> {appt.status}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Urgency Level:</span> {appt.urgency}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <span className="font-medium">Cause:</span> {appt.cause.trim()}
            </div>
            </div>

            <button
              onClick={() => setSelectedDoctor(appt)}
              className="mt-auto  bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
            >
              View Doctor
            </button>
                </div>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <DoctorModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
     </div>
    </>
  );
};

export default MyAppointment;
