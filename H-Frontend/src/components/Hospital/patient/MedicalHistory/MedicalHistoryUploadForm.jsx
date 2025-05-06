import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { uploadMedicalHistory } from './medicalHistoryAPI';
import MedicalHistoryList from './MedicalHistoryList'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const MedicalHistoryUploadForm = () => {
  const { id: patientId } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      patientId,
      file: null,
    },
    enableReinitialize: true, // in case patientId is loaded async
    validationSchema: Yup.object({
      file: Yup.mixed()
        .required('File is required')
        .test('fileType', 'Only PDF, JPG, PNG allowed', (value) =>
          value ? ['application/pdf', 'image/jpeg', 'image/png'].includes(value.type) : false
        )
        .test('fileSize', 'File too large (max 5MB)', (value) =>
          value ? value.size <= 5 * 1024 * 1024 : false
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append('patientId', patientId); // FIX: use from Redux
        formData.append('file', values.file);

        await uploadMedicalHistory(formData);
        toast.success('Uploaded successfully');
        resetForm();
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.error || 'Upload failed');
      }
    },
  });
  {console.log(patientId)}
  return (
    <>
     <form onSubmit={formik.handleSubmit} className="space-y-6 p-8 bg-white shadow-lg rounded-xl max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Upload Medical History</h2>

      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2">Choose File</label>
        <input
          type="file"
          name="file"
          onChange={(event) => formik.setFieldValue('file', event.currentTarget.files[0])}
          className="mt-2 block w-full border-2 border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          accept=".pdf,.jpg,.jpeg,.png"
        />
        {formik.touched.file && formik.errors.file && (
          <p className="text-red-500 text-sm mt-2">{formik.errors.file}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white font-semibold text-lg rounded-md shadow-md hover:bg-blue-700 transition-all focus:outline-none"
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting ? 'Uploading...' : 'Upload'}
      </button>
      </form>
      
      <MedicalHistoryList
      patientId={patientId}
        role="Patient"
      />
    </>
  );
};

export default MedicalHistoryUploadForm;
