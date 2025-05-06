import axios from 'axios';

export const uploadMedicalHistory = async (formData) => {
  return await axios.post('http://localhost:5000/api/patients/upload-history', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};


export const getMedicalHistoryByPatient = async (patientId) => {
    const res = await axios.get(`http://localhost:5000/api/patients/patient-history`, {
      params: { patientId },
    });
    return res.data;
  };