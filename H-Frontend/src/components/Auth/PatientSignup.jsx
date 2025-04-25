// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router';

// const Signup = () => {
//   const navigate = useNavigate();
//   // Determine signup type based on Admin token in localStorage.
//   // If an Admin is logged in, signup will be for Hospital; otherwise, it's for Patient.
//   const [signupType, setSignupType] = useState('patient');

//   useEffect(() => {
//     const storedRole = localStorage.getItem('role');
//     if (storedRole && storedRole === 'Admin') {
//       setSignupType('hospital');
//     } else {
//       setSignupType('patient');
//     }
//   }, []);

//   // For Patient, the name field acts as username.
//   // For Hospital, it's the hospital name.
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phoneNumber: '',
//     address: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [message, setMessage] = useState(null);
//   const [token, setToken] = useState(null);
//   const [termsChecked, setTermsChecked] = useState(false);

//   // Update form field values
//   const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
//   const toggleTerms = () => setTermsChecked(!termsChecked);

//   // Handle form submission
//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setMessage(null);

//     if (formData.password !== formData.confirmPassword) {
//       setMessage('Passwords do not match');
//       return;
//     }
//     if (!termsChecked) {
//       setMessage('You must agree to the Terms and Conditions');
//       return;
//     }

//     try {
//       // Determine endpoint based on signupType
//       const endpoint =
//         signupType === 'patient'
//           ? 'http://localhost:5000/api/auth/patient/signup'
//           : 'http://localhost:5000/api/auth/hospital/signup';

//       // Build payload:
//       // For Patient, send username field; for Hospital, send name field.
//       const payload =
//         signupType === 'patient'
//           ? { username: formData.name, address: formData.address, phoneNumber: formData.phoneNumber,  email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword }
//           : { name: formData.name, address: formData.address, phoneNumber: formData.phoneNumber, email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword };

//       const res = await axios.post(endpoint, payload);
//       setMessage(res.data.msg);
//       setToken(res.data.token);
//       alert(res.data.msg);
//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('role', res.data.role);
//       console.log(res.data)
//       res.data.role == "Patient" ? localStorage.setItem('patientId', res.data.id): localStorage.setItem('hospitalId', res.data.id);
//       navigate('/posts');
//     } catch (err) {
//       setMessage(err.response?.data?.msg || 'Something went wrong');
//     }
//   };

//   return (
//     <div className="container my-5">
//       {token && (
//         <div style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: '#f4f4f4', padding: '10px', color: 'black' }}>
//           <h3>Token:</h3>
//           <p>{token}</p>
//         </div>
//       )}
//       <div className="row justify-content-center">
//         <div
//           className="col-md-6"
//           style={{
//             padding: '40px',
//             backgroundColor: 'white',
//             boxShadow: '0 4px 8px rgba(0,0,0,0.7)',
//             borderRadius: '20px',
//           }}
//         >
//           {message && (
//             <div style={{ marginBottom: '20px', color: token ? '#00FF00' : 'red' }}>
//               {message}
//             </div>
//           )}
//           <form onSubmit={onSubmit}>
//             <div className="text-center mb-4">
//               <h1>Signup as {signupType === 'patient' ? 'Patient' : 'Hospital'}</h1>
//             </div>
//             <div className="mb-3">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder={signupType === 'patient' ? 'Username' : 'Hospital Name'}
//                 name="name"
//                 value={formData.name}
//                 onChange={onChange}
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <input
//                 type="email"
//                 className="form-control"
//                 placeholder="Email"
//                 name="email"
//                 value={formData.email}
//                 onChange={onChange}
//                 required
//               />
//             </div>
//             <div className="row">
//               <div className="col-6 mb-3">
//                 <input
//                   type="number"
//                   className="form-control"
//                   placeholder="Phone Number"
//                   name="phoneNumber"
//                   value={formData.phoneNumber}
//                   onChange={onChange}
//                   required
//                 />
//               </div>
//               <div className="col-6 mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Address"
//                   name="address"
//                   value={formData.address}
//                   onChange={onChange}
//                   required
//                 />
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-6 mb-3">
//                 <input
//                   type="password"
//                   className="form-control"
//                   placeholder="Password"
//                   name="password"
//                   value={formData.password}
//                   onChange={onChange}
//                   required
//                 />
//               </div>
//               <div className="col-6 mb-3">
//                 <input
//                   type="password"
//                   className="form-control"
//                   placeholder="Confirm Password"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={onChange}
//                   required
//                 />
//               </div>
//             </div>
//             <div className="mb-3 form-check">
//               <input type="checkbox" className="form-check-input" id="termsCheck" checked={termsChecked} onChange={toggleTerms} required />
//               <label className="form-check-label" htmlFor="termsCheck">
//                 I agree to the Terms and Conditions
//               </label>
//             </div>
//             <button type="submit" className="btn btn-primary w-100" disabled={!termsChecked}>
//               Signup
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { loginSuccess } from '../../store/authSlice';

const validationSchema = Yup.object({
  username: Yup.string().min(3, 'Minimum 3 characters').required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
    .required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  terms: Yup.boolean().oneOf([true], 'You must agree to the Terms and Conditions'),
});

const PatientSignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
    terms: false,
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/patient/signup', {
        username: values.username,
        email: values.email,
        phoneNumber: values.phoneNumber,
        address: values.address,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      const data = res.data;

      if (res.status === 200) {
        toast.success(data.msg);
        dispatch(loginSuccess({
          role: data.role,
          token: data.token,
          id: data.id
        }));
        setStatus({ success: data.msg });
        navigate('/');
      }
    } catch (error) {
      setStatus({ error: error.response?.data?.msg || 'Signup failed' });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6">
        <h2 className="text-center text-2xl font-bold text-blue-700">Patient Signup</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="space-y-5">
              {status?.success && <div className="text-green-600 text-sm text-center">{status.success}</div>}
              {status?.error && <div className="text-red-500 text-sm text-center">{status.error}</div>}

              {/* Username */}
              <div>
                <Field
                  name="username"
                  type="text"
                  placeholder="Username"
                  className="w-full px-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="username" component="p" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Email */}
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Phone */}
              <div>
                <Field
                  name="phoneNumber"
                  type="text"
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="phoneNumber" component="p" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Address */}
              <div>
                <Field
                  name="address"
                  type="text"
                  placeholder="Address"
                  className="w-full px-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="address" component="p" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="password" component="p" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <Field
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-xs mt-1" />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-2">
                <Field
                  type="checkbox"
                  name="terms"
                  id="terms"
                  className="mt-1 cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm cursor-pointer ml-2">
                  I agree to the Terms and Conditions
                </label>
              </div>
              <ErrorMessage name="terms" component="p" className="text-red-500 text-xs" />

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md shadow transition disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing up...' : 'Signup'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PatientSignup;
