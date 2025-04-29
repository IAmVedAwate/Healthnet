import React, { useState, useEffect, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  LocalizationProvider,
  DateTimePicker,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  TextField,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          backgroundColor: '#f8fafc',
        },
      },
    },
  },
});

const AppointmentModal = ({ doctor, slots, onClose }) => {
  const { id } = useSelector((state) => state.auth);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/patients/me/${id}`
        );
        setPatient(data);
      } catch (err) {
        toast.error('Failed to load patient data');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const initialValues = useMemo(() => ({
    issue: '',
    selectedSlot: '',
    appointmentDateTime: null,
  }), []);

  const validationSchema = Yup.object({
    issue: Yup.string().required('Please describe the issue'),
    selectedSlot: Yup.string().required('Select a slot'),
    appointmentDateTime: Yup.date().required('Select appointment time'),
  });

  const getSelectedSlot = (slotId) =>
    slots.find((s) => s.slotId === slotId) || null;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const appointmentTime = new Date(values.appointmentDateTime.getTime() + (5.5 * 60 * 60 * 1000))
  .toISOString()
  .slice(0, 19)
  //.replace('T', ' ');

      console.log(appointmentTime);
  //     const qq = await axios.get(`http://localhost:5050/get_queue?hospitalId=d6224e00-b9fa-4cce-b3a8-6ae76df3c030`)
  //  console.log(qq.data)

      const res = await axios.post('http://localhost:5050/enqueue_case', {
        doctorId: doctor.doctorId,
        hospitalId:doctor.hospitalId,
        patientId: patient.patientId,
        departmentId: doctor.departmentId,
        //slotId: values.selectedSlot,
        arrivalTime:appointmentTime,
        cause: values.issue,
        urgency: '0',
        stauts:"Pending",
      });

      

      toast.success('Appointment booked!');
      onClose();
    } catch (error) {
      console.log(error)
      toast.error('Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !patient) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <CircularProgress />
        </div>
      </div>
    );
  }

  return (
    <div
  className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center overflow-y-auto px-4 py-8"
  role="dialog"
  aria-modal="true"
>
  <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fadeIn space-y-6">
    
    {/* Close Button */}
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-gray-500 hover:text-red-600 z-10"
      aria-label="Close modal"
    >
      <CloseIcon />
    </button>

    {/* Title */}
    <h2 className="text-2xl font-bold text-teal-600 text-center">
      Book Appointment with Dr. {doctor.firstName} {doctor.lastName}
    </h2>

    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => {
            const selectedSlot = getSelectedSlot(values.selectedSlot);
            const minTime = selectedSlot
              ? new Date(`1970-01-01T${selectedSlot.startTime}`)
              : null;
            const maxTime = selectedSlot
              ? subtractMinutes(new Date(`1970-01-01T${selectedSlot.endTime}`), 15)
              : null;

            return (
              <Form className="space-y-4">
                
                {/* Patient Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <TextField label="Name" value={patient.username} fullWidth disabled />
                  <TextField label="Email" value={patient.email} fullWidth disabled />
                  <TextField label="Phone" value={patient.phoneNumber} fullWidth disabled />
                </div>

                {/* Issue Field */}
                <div>
                  <Field
                    name="issue"
                    as="textarea"
                    rows="3"
                    placeholder="Describe your issue"
                    className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <ErrorMessage
                    name="issue"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Slot Selection */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Select Slot
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {slots.map((slot) => (
                      <button
                        key={slot.slotId}
                        type="button"
                        onClick={() => {
                          setFieldValue('selectedSlot', slot.slotId);
                          setFieldValue('appointmentDateTime', null);
                        }}
                        className={`border rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          values.selectedSlot === slot.slotId
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {slot.startTime} - {slot.endTime}
                      </button>
                    ))}
                  </div>
                  <ErrorMessage
                    name="selectedSlot"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* DateTime Picker */}
                {selectedSlot && (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Select Date & Time
                    </label>
                    <DateTimePicker
  label="Appointment Date & Time"
  value={values.appointmentDateTime}
  onChange={(newValue) =>
    setFieldValue('appointmentDateTime', newValue)
  }
  minDate={new Date()} // 🔒 Prevents past dates
  minTime={minTime}
  maxTime={maxTime}
  minutesStep={15}
  renderInput={(params) => <TextField {...params} fullWidth />}
/>

                    <ErrorMessage
                      name="appointmentDateTime"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md font-semibold transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Booking...' : 'Book Appointment'}
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

// Utils
function subtractMinutes(date, minutes) {
  return new Date(date.getTime() - minutes * 60000);
}
