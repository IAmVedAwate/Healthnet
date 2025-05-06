// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router';

// const ResetPassword = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     previousPassword: '',
//     newPassword: '',
//   });
//   const [message, setMessage] = useState(null);
//   const navigate = useNavigate();

//   // Handle form data changes
//   const onChange = e =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   // Handle form submission
//   const onSubmit = async e => {
//     e.preventDefault();
//     try {
//       // Change endpoint according to your API route
//       const res = await axios.post('http://localhost:5000/api/auth/reset-password', formData);
//       setMessage(res.data.msg);
//       alert(res.data.msg);
//       // navigate('/posts');
//     } catch (err) {
//       setMessage(err.response?.data?.msg || 'Error resetting password.');
//     }
//   };

//   return (
//     <div className='container' style={{ padding: "40px", backgroundColor: "white", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.7)", borderRadius: "20px" }}>
//       {message && <div style={{ paddingBottom: "20px", color: 'red' }}>{message}</div>}
//       <form onSubmit={onSubmit} className="container-sm">
//         <div className="mb-3">
//           <label className="form-label">Email</label>
//           <input
//             type="email"
//             className="form-control"
//             name="email"
//             value={formData.email}
//             onChange={onChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">Previous Password</label>
//           <input
//             type="password"
//             className="form-control"
//             name="previousPassword"
//             value={formData.previousPassword}
//             onChange={onChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">New Password</label>
//           <input
//             type="password"
//             className="form-control"
//             name="newPassword"
//             value={formData.newPassword}
//             onChange={onChange}
//             required
//           />
//         </div>
//         <button type="submit" className="btn btn-primary">Reset Password</button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [message, setMessage] = React.useState(null);

  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email('Invalid email format')
      .required('Email is required'),
    previousPassword: Yup.string().required('Previous password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(64, 'Password cannot exceed 64 characters')
      .matches(/[A-Z]/, 'Must include at least one uppercase letter')
      .matches(/[a-z]/, 'Must include at least one lowercase letter')
      .matches(/\d/, 'Must include at least one number')
      .matches(/[@$!%*?&#]/, 'Must include at least one special character')
      .required('New password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      previousPassword: '',
      newPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/reset-password', values);
        setMessage(res.data.msg);
        alert(res.data.msg);
        resetForm();
        // navigate('/login');
      } catch (err) {
        setMessage(err.response?.data?.msg || 'Error resetting password.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl px-8 py-10 border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Reset Password</h2>

        {message && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            {message}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@example.com"
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                formik.touched.email && formik.errors.email
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              }`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-xs text-red-600 mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Previous Password */}
          <div>
            <label htmlFor="previousPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Previous Password
            </label>
            <input
              type="password"
              id="previousPassword"
              name="previousPassword"
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                formik.touched.previousPassword && formik.errors.previousPassword
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              }`}
              value={formik.values.previousPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.previousPassword && formik.errors.previousPassword && (
              <p className="text-xs text-red-600 mt-1">{formik.errors.previousPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                formik.touched.newPassword && formik.errors.newPassword
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-green-400'
              }`}
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="text-xs text-red-600 mt-1">{formik.errors.newPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-semibold py-2 rounded-lg shadow-lg transition-all duration-300 ${
              formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {formik.isSubmitting ? 'Processing...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
