import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Tailwind-friendly MUI theme override
const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          backgroundColor: '#f8fafc',
          '& .MuiInputBase-root': {
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            height: '2.75rem',
          },
        },
      },
    },
  },
});

const AppointmentModal = ({ doctor, slots, onClose }) => {
  const initialValues = {
    patientName: '',
    email: '',
    phone: '',
    selectedSlot: '',
    selectedTime: null, // should be a Date object not string
  };

  const validationSchema = Yup.object({
    patientName: Yup.string().required('Patient name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone must be exactly 10 digits')
      .required('Phone number is required'),
    selectedSlot: Yup.string().required('Please select a slot'),
    selectedTime: Yup.date().required('Please select a time'),
  });

  const handleSubmit = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/appointments/book', {
        doctorId: doctor.doctorId,
        slotId: values.selectedSlot,
        appointmentTime: formatTime(values.selectedTime), // Convert Date to "HH:mm"
        patientName: values.patientName,
        email: values.email,
        phone: values.phone,
      });
      toast.success('Appointment booked successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to book appointment.');
    }
  };

  const getSelectedSlot = (slotId) => {
    return slots?.find((slot) => slot.slotId === slotId) || null;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-md animate-fadeIn">
              {/* Close Button */}
<button
  type="button"
  onClick={onClose}
  className="absolute top-4 right-2 text-gray-500 hover:text-gray-700"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
</button>


        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => {
                const activeSlot = getSelectedSlot(values.selectedSlot);

                return (
                  <Form className="space-y-5">

                    {/* Patient Name */}
                    <div>
                      <Field
                        name="patientName"
                        type="text"
                        placeholder="Patient Name"
                        className="w-full border rounded px-4 py-2 focus:outline-teal-500"
                      />
                      <ErrorMessage name="patientName" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    {/* Email */}
                    <div>
                      <Field
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        className="w-full border rounded px-4 py-2 focus:outline-teal-500"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    {/* Phone */}
                    <div>
                      <Field
                        name="phone"
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full border rounded px-4 py-2 focus:outline-teal-500"
                      />
                      <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    {/* Slots */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Select Slot</label>
                      <div className="grid grid-cols-2 gap-2">
                        {slots?.length > 0 ? (
                          slots.map((slot) => (
                            <button
                              key={slot.slotId}
                              type="button"
                              onClick={() => {
                                setFieldValue('selectedSlot', slot.slotId);
                                setFieldValue('selectedTime', null); // reset time
                              }}
                              className={`border rounded px-3 py-2 text-sm ${
                                values.selectedSlot === slot.slotId
                                  ? 'bg-teal-500 text-white'
                                  : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                            >
                              {slot.startTime} - {slot.endTime}
                            </button>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm">No slots available</p>
                        )}
                      </div>
                      <ErrorMessage name="selectedSlot" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    {/* Time Picker */}
                    {activeSlot && (
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Select Time
                        </label>

                        <TimePicker
                          ampm={false}
                          minutesStep={15}
                          value={values.selectedTime}
                          onChange={(newValue) => setFieldValue('selectedTime', newValue)}
                          minTime={new Date(`1970-01-01T${activeSlot.startTime}`)}
                          maxTime={subtractMinutes(new Date(`1970-01-01T${activeSlot.endTime}`), 15)}
                          renderInput={(params) => (
                            <TextField {...params} fullWidth />
                          )}
                        />
                        <ErrorMessage name="selectedTime" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded font-semibold transition"
                    >
                      Confirm Booking
                    </button>
                  </Form>
                );
              }}
            </Formik>

          </LocalizationProvider>
        </ThemeProvider>

      </div>
    </div>
  );
};

export default AppointmentModal;

// Helper Functions
function subtractMinutes(date, minutes) {
  return new Date(date.getTime() - minutes * 60000);
}

function formatTime(date) {
  if (!date) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}
