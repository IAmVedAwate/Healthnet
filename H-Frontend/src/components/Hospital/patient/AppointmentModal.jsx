import React, { useState, useEffect, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  LocalizationProvider,
  DateTimePicker,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  TextField,
  CircularProgress,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useParams } from 'react-router';

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
  const { hospitalId } = useParams();
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
    name: '',
    age: '',
    gender: '',
    contactInfo: '',
  }), []);

  const validationSchema = Yup.object({
    issue: Yup.string().required('Please describe the issue'),
    selectedSlot: Yup.string().required('Select a slot'),
    appointmentDateTime: Yup.date().required('Select appointment time'),
    name: Yup.string().required('Enter patient name'),
    age: Yup.number().required('Enter patient age'),
    gender: Yup.string().required('Enter patient gender'),
    contactInfo: Yup.string().required('Enter contact info'),
  });

  const getSelectedSlot = (slotId) =>
    slots.find((s) => s.slotId === slotId) || null;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // 1) Create PatientData record
      const addRes = await axios.post(
        'http://localhost:5000/api/patients/add',
        {
          hospitalId,
          name: values.name,
          age: values.age,
          gender: values.gender,
          doctorId: doctor.doctorId,
          contactInfo: values.contactInfo,
          status: 'Pending',
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const { patientDataId } = addRes.data;
      console.warn(addRes.data?.patientDataId);

      // 2) Enqueue case using new patientDataId
      const appointmentTime = new Date(
        values.appointmentDateTime.getTime() + 5.5 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 19);

      await axios.post(
        'http://localhost:5050/enqueue_case',
        {
          doctorId: doctor.doctorId,
          hospitalId,
          patientId: patient.patientId,
          patientAssignId: patientDataId,
          departmentId: doctor.departmentId,
          arrivalTime: appointmentTime,
          cause: values.issue,
          urgency: '0',
          status: 'Pending',
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      toast.success('Appointment and patient record created successfully!');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create appointment');
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 z-10"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>
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
                  ? subtractMinutes(
                      new Date(`1970-01-01T${selectedSlot.endTime}`),
                      15
                    )
                  : null;

                return (
                  <Form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <TextField label="Name" value={patient.username} fullWidth disabled />
                      <TextField label="Email" value={patient.email} fullWidth disabled />
                      <TextField label="Phone" value={patient.phoneNumber} fullWidth disabled />
                    </div>

                    <Field
                      name="issue"
                      as="textarea"
                      rows="3"
                      placeholder="Describe your issue"
                      className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                    <ErrorMessage name="issue" component="div" className="text-red-500 text-sm mt-1" />

                    <Field
                      name="name"
                      placeholder="Patient Legal Name"
                      className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />

                    <div className="grid grid-cols-2 gap-4">
                      {/* Age Input */}
                      <div>
                        <Field
                          name="age"
                          type="number"
                          placeholder="Patient Age"
                          className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                        <ErrorMessage
                          name="age"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Gender Select */}
                      <div>
                        <Field
                          as="select"
                          name="gender"
                          className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                        >
                          <option value="" disabled>
                            Select Gender
                          </option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </Field>
                        <ErrorMessage
                          name="gender"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>


                    <Field
                      name="contactInfo"
                      placeholder="Patient Contact Info"
                      className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                    <ErrorMessage name="contactInfo" component="div" className="text-red-500 text-sm mt-1" />

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Select Slot</label>
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
                      <ErrorMessage name="selectedSlot" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {selectedSlot && (
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Select Date & Time</label>
                        <DateTimePicker
                          label="Appointment Date & Time"
                          value={values.appointmentDateTime}
                          onChange={(newValue) => setFieldValue('appointmentDateTime', newValue)}
                          minDate={new Date()}
                          minTime={minTime}
                          maxTime={maxTime}
                          minutesStep={15}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                        <ErrorMessage name="appointmentDateTime" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    )}

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
