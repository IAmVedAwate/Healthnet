import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';

const BookAppointment = () => {
  const [hospitals, setHospitals] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/hospitals", {
          headers: { "access-token": token },
        });
        setHospitals(response.data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };
    fetchHospitals();
  }, [token]);


  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className='flex justify-between'> 
      <h1 className="text-3xl font-bold text-center mb-10 text-teal-600">Select a Hospital</h1>
        <Link to={"/patients/my-appointments"}>
        <button className='bg-blue-600 p-2 rounded-2xl text-white hover:scale-110 transition'>My Appointments</button>
        </Link>
     </div>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {hospitals.map((hospital) => (
  <Link to={`/doctor-select/${hospital.hospitalId}`} key={hospital.hospitalId}>
    <div
      className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-6 flex flex-col justify-between"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{hospital.hospitalName}</h2>
        <p className="text-gray-600 text-sm mb-1">
          Location: <span className="font-medium">{hospital.hospitalLocation}</span>
        </p>
        <p className="text-gray-600 text-sm">
          Contact: <span className="font-medium">{hospital.hospitalContactInfo}</span>
        </p>
      </div>
      <div className="mt-4 space-x-2">
        <span className="inline-block bg-teal-100 text-teal-800 text-xs font-semibold rounded-full px-3 py-1">
          People in Queue: {hospital.peopleInQueue}
              </span>
              <span className="inline-block bg-yellow-100 text-teal-800 text-xs font-semibold rounded-full px-3 py-1">
              Available Beds: {hospital.availableBeds}
        </span>
      </div>
    </div>
  </Link>
))}

      </div>
    </div>
  );
};

export default BookAppointment;
