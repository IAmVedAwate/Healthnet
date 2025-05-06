// import React from 'react';
// import { useNavigate } from 'react-router';
// import { useFormik } from 'formik';
// import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { loginSuccess } from '../../store/authSlice';
// import { toast } from 'react-toastify';

// const Login = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const formik = useFormik({
//     initialValues: {
//       email: '',
//       password: '',
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
//     onSubmit: async (values, { setSubmitting }) => {
//       try {
//         const { data } = await axios.post('http://localhost:5000/api/auth/login', values);
//         console.log(data)
//         toast.success(data.msg);

//         dispatch(
//           loginSuccess({
//             role: data.role,
//             token: data.token,
//             id: data.id,
//           })
//         );
// console.log(data.role.toLowerCase())
//         switch (data.role.toLowerCase()) {
//           case 'hospital':
//             navigate('/');
//             break;
//           case 'patient':
//             navigate('/patients');
//             break;
//           case 'admin':
//             navigate('/admin');
//             break;
//           default:
//             navigate('/');
//             break;
//         }
//       } catch (err) {
//         const msg = err.response?.data?.msg || 'Something went wrong';
//         toast.error(msg);
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
//         <form onSubmit={formik.handleSubmit}>
//           <h2 className="text-3xl text-center font-bold text-gray-800 mb-4">Login</h2>

//           <div className="mb-4">
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 formik.errors.email && formik.touched.email ? 'border-red-500' : 'border-gray-300'
//               }`}
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
//               placeholder="Password"
//               className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 formik.errors.password && formik.touched.password ? 'border-red-500' : 'border-gray-300'
//               }`}
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
//             disabled={formik.isSubmitting}
//             className={`w-full p-3 bg-blue-600 text-white rounded-lg shadow-md focus:outline-none transition ${
//               formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//           >
//             {formik.isSubmitting ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React from 'react';
import { useNavigate } from 'react-router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),

    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(64, 'Password cannot exceed 64 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data } = await axios.post('http://localhost:5000/api/auth/login', values);
        toast.success(data.msg);

        dispatch(
          loginSuccess({
            role: data.role,
            token: data.token,
            id: data.id,
          })
        );

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
