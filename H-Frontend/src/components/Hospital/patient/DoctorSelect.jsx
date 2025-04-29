import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppointmentModal from './AppointmentModal'; // Import modal component

const DoctorSelect = () => {
  const [doctors, setDoctors] = useState([]);
  const [slotsByDoctor, setSlotsByDoctor] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const { hospitalId } = useParams();

  useEffect(() => {
    const fetchDoctorsAndSlots = async () => {
      try {
        const doctorsRes = await axios.get(`http://localhost:5000/api/doctors/all/${hospitalId}`);
        const doctorsData = doctorsRes.data;
          setDoctors(doctorsData);
          

        const slotsData = {};
        await Promise.all(
          doctorsData.map(async (doctor) => {
            const slotRes = await axios.get(`http://localhost:5000/api/doctor/slots`, {
              params: { doctorid: doctor.doctorId },
            });
              slotsData[doctor.doctorId] = slotRes.data || [];
              console.log(slotRes.data)
          })
        );
          setSlotsByDoctor(slotsData);
         
      } catch (error) {
        console.error("Failed to fetch doctors or slots:", error);
        toast.error("Error fetching doctors or slots.");
      }
    };

    if (hospitalId) {
      fetchDoctorsAndSlots();
    }
  }, [hospitalId]);

  const openBookingModal = (doctor) => {
    setSelectedDoctor(doctor);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-center mb-8 text-teal-600">Select a Doctor & Book an Appointment</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {doctors.length > 0 ? (
          doctors.map((doctor) => {
            const doctorSlots = slotsByDoctor[doctor.doctorId] || [];
            const hasAvailableSlots = doctorSlots.length > 0;

            return (
              <div
                key={doctor.doctorId}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h2>
                  <p className="text-gray-600 text-sm mb-1">Specialization: {doctor.specialization}</p>
                  <p className="text-gray-600 text-sm mb-1">Experience: {doctor.experience} years</p>
                  <p className="text-gray-600 text-sm">Phone: {doctor.phoneNumber}</p>
                  <p className="text-gray-600 text-sm mb-4">Email: {doctor.email}</p>
                </div>

                {/* Show button only if slots available */}
                {hasAvailableSlots ? (
                  <button
                    onClick={() => openBookingModal(doctor)}
                    className="bg-teal-500 text-white px-4 py-2 rounded mt-4 hover:bg-teal-600 transition"
                  >
                    Book Appointment
                  </button>
                ) : (
                  <p className="text-red-500 text-center font-medium mt-4">No Slots Available</p>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 col-span-full">No doctors found.</p>
        )}
      </div>

      {/* Modal */}
      {selectedDoctor && (
        <AppointmentModal
          doctor={selectedDoctor}
          slots={slotsByDoctor[selectedDoctor.doctorId]}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </div>
  );
};

export default DoctorSelect;
