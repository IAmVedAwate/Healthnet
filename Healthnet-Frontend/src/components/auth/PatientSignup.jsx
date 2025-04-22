// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

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
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { loginSuccess } from '../../store/authSlice';

const PatientSignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      phoneNumber: '',
      address: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
    validationSchema: Yup.object({
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
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/patient/signup', {
          username: values.username,
          email: values.email,
          phoneNumber: values.phoneNumber,
          address: values.address,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });
        const data = await res.data;

        console.log(data);
        if (res.status === 200) {
          toast.success(data.msg);
        dispatch(loginSuccess(
          {
            role: data.role,
            token: data.token,
            id: data.id
          }
        ))
        
        setStatus({ success: res.data.msg });
        navigate('/');
      }
      } catch (error) {
        setStatus({ error: error.response?.data?.msg || 'Signup failed' });
        console.log(error)
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6">
        <h2 className="text-center text-2xl font-bold text-blue-700">Patient Signup</h2>

        {formik.status?.success && (
          <div className="text-green-600 text-sm text-center">{formik.status.success}</div>
        )}
        {formik.status?.error && (
          <div className="text-red-500 text-sm text-center">{formik.status.error}</div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className={`w-full px-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.username && formik.errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              {...formik.getFieldProps('username')}
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`w-full px-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              className={`w-full px-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.phoneNumber && formik.errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              {...formik.getFieldProps('phoneNumber')}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.phoneNumber}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <input
              type="text"
              name="address"
              placeholder="Address"
              className={`w-full px-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.address && formik.errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              {...formik.getFieldProps('address')}
            />
            {formik.touched.address && formik.errors.address && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.address}</p>
            )}
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={`w-full px-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={`w-full px-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                {...formik.getFieldProps('confirmPassword')}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              name="terms"
              id="terms"
              className="mt-1 cursor-pointer"
              {...formik.getFieldProps('terms')}
            />
            <label htmlFor="terms" className="text-sm cursor-pointer ml-2">
              I agree to the Terms and Conditions
            </label>
          </div>
          {formik.touched.terms && formik.errors.terms && (
            <p className="text-red-500 text-xs">{formik.errors.terms}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md shadow transition disabled:opacity-50"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Signing up...' : 'Signup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientSignup;

