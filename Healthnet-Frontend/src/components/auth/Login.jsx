// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Handle changes in form fields
//   const onChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     // Clear specific error when user types
//     setErrors({ ...errors, [e.target.name]: '' });
//   };

//   // Basic validations for email and password
//   const validateForm = () => {
//     const newErrors = {};
//     const emailRegex = /\S+@\S+\.\S+/;
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!emailRegex.test(formData.email)) {
//       newErrors.email = 'Invalid email address';
//     }
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     }
//     return newErrors;
//   };

//   // Handle form submission
//   const onSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/login', formData);
//       console.log(res)
//       setMessage(res.data.msg);
//       setToken(res.data.token);
//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('role', res.data.role);
//       console.log(res.data);
      
//       res.data.role == "Patient" ? localStorage.setItem('patientId', res.data.id): localStorage.setItem('hospitalId', res.data.id);
//       navigate('/'); // Redirect after successful login
//     } catch (err) {
//       setMessage(err.response?.data?.msg || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       {token && (
//         <div style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: '#f4f4f4', padding: '10px' }}>
//           <h3>Token:</h3>
//           <p>{token}</p>
//         </div>
//       )}
//       <div className="row my-5 justify-content-center">
//         <div
//           className="col-md-6 col-lg-4"
//           style={{
//             padding: '40px',
//             backgroundColor: '#fff',
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//             borderRadius: '10px',
//           }}
//         >
//           {message && (
//             <div style={{ marginBottom: '20px', color: token ? '#00FF00' : 'red' }}>
//               {message}
//             </div>
//           )}
//           <form onSubmit={onSubmit}>
//             <div className="text-center mb-4">
//               <h1>Login</h1>
//             </div>
//             <div className="mb-3">
//               <input
//                 type="email"
//                 className={`form-control ${errors.email ? 'is-invalid' : ''}`}
//                 placeholder="Email"
//                 name="email"
//                 value={formData.email}
//                 onChange={onChange}
//                 required
//               />
//               {errors.email && <div className="invalid-feedback">{errors.email}</div>}
//             </div>
//             <div className="mb-3">
//               <input
//                 type="password"
//                 className={`form-control ${errors.password ? 'is-invalid' : ''}`}
//                 placeholder="Password"
//                 name="password"
//                 value={formData.password}
//                 onChange={onChange}
//                 required
//               />
//               {errors.password && <div className="invalid-feedback">{errors.password}</div>}
//             </div>
//             <button type="submit" className="btn btn-primary w-100" disabled={loading}>
//               {loading ? 'Logging in...' : 'Login'}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useFormik } from 'formik';
// import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { loginSuccess } from '../../store/authSlice';
// import { toast } from "react-toastify";


// const Login = () => {
//   const [message, setMessage] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const formik = useFormik({
//     initialValues: {
//       email: '',
//       password: ''
//     },
//     validate: (values) => {
//       const errors = {};
//       const emailRegex = /\S+@\S+\.\S+/;
      
//       if (!values.email) {
//         errors.email = 'Email is required';
//       } else if (!emailRegex.test(values.email)) {
//         errors.email = 'Invalid email address';
//       }

//       if (!values.password) {
//         errors.password = 'Password is required';
//       }

//       return errors;
//     },
//     onSubmit: async (values) => {
//       setLoading(true);
//       try {
//         const res = await axios.post('http://localhost:5000/api/auth/login', values);
//         setMessage(res.data.msg);
//         setToken(res.data.token);
//         localStorage.setItem('token', res.data.token);
//         localStorage.setItem('role', res.data.role);
        
        
//         if (res.data.role === 'Patient') {
//           localStorage.setItem('patientId', res.data.id);
//         } else {
//           localStorage.setItem('hospitalId', res.data.id);
//         }
//         console.log(res)
//         if (res.data.status === 200) {
//           toast.success(res.data.msg)
//           dispatch(loginSuccess({
//             role: res.data.role,
//             token: res.data.token,
            
//           }));
    
//           // Redirect based on role
//           switch (data.role) {
//             case "hospital":
//               navigate("/hospitals");
//               break;
//             case "patient":
//               navigate("/patients");
//               break;
//             case "admin":
//               navigate("/admin");
//               break;
//             default:
//               navigate("/");
//               break;
//           }
//         }
//       } catch (err) {
//         setMessage(err.response?.data?.msg || 'Something went wrong');
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
//         {message && (
//           <div className={`mb-4 text-center text-sm font-semibold ${token ? 'text-green-600' : 'text-red-600'}`}>
//             {message}
//           </div>
//         )}
//         <form onSubmit={formik.handleSubmit}>
//           <h2 className="text-3xl text-center font-bold text-gray-800 mb-4">Login</h2>
//           <div className="mb-4">
//             <input
//               type="email"
//               name="email"
//               id="email"
//               placeholder="Email"
//               className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formik.errors.email && formik.touched.email ? 'border-red-500' : 'border-gray-300'}`}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.email}
//             />
//             {formik.errors.email && formik.touched.email && (
//               <div className="text-sm text-red-600 mt-1">{formik.errors.email}</div>
//             )}
//           </div>

//           <div className="mb-6">
//             <input
//               type="password"
//               name="password"
//               id="password"
//               placeholder="Password"
//               className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formik.errors.password && formik.touched.password ? 'border-red-500' : 'border-gray-300'}`}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.password}
//             />
//             {formik.errors.password && formik.touched.password && (
//               <div className="text-sm text-red-600 mt-1">{formik.errors.password}</div>
//             )}
//           </div>

//           <button
//             type="submit"
//             className={`w-full p-3 bg-blue-600 text-white rounded-lg shadow-md focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//             disabled={loading}
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors = {};
      const emailRegex = /\S+@\S+\.\S+/;

      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!emailRegex.test(values.email)) {
        errors.email = 'Invalid email address';
      }

      if (!values.password) {
        errors.password = 'Password is required';
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data } = await axios.post('http://localhost:5000/api/auth/login', values);
        console.log(data)
        toast.success(data.msg);

        dispatch(
          loginSuccess({
            role: data.role,
            token: data.token,
            id: data.id,
          })
        );
console.log(data.role.toLowerCase())
        switch (data.role.toLowerCase()) {
          case 'hospital':
            navigate('/');
            break;
          case 'patient':
            navigate('/patients');
            break;
          case 'admin':
            navigate('/admin');
            break;
          default:
            navigate('/');
            break;
        }
      } catch (err) {
        const msg = err.response?.data?.msg || 'Something went wrong';
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <form onSubmit={formik.handleSubmit}>
          <h2 className="text-3xl text-center font-bold text-gray-800 mb-4">Login</h2>

          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.errors.email && formik.touched.email ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.errors.email && formik.touched.email && (
              <div className="text-sm text-red-600 mt-1">{formik.errors.email}</div>
            )}
          </div>

          <div className="mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.errors.password && formik.touched.password ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.errors.password && formik.touched.password && (
              <div className="text-sm text-red-600 mt-1">{formik.errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full p-3 bg-blue-600 text-white rounded-lg shadow-md focus:outline-none transition ${
              formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
