import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { loginSuccess } from '../../store/authSlice';


const validationSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Only alphanumeric characters and underscores are allowed')
    .required('Username is required'),

  email: Yup.string()
    .trim()
    .email('Invalid email format')
    .max(254, 'Email cannot exceed 254 characters')
    .required('Email is required'),

  phoneNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Phone must be a valid 10-digit Indian number')
    .required('Phone number is required'),

  address: Yup.string()
    .trim()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address cannot exceed 200 characters')
    .required('Address is required'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password cannot exceed 64 characters')
    .matches(/[A-Z]/, 'At least one uppercase letter required')
    .matches(/[a-z]/, 'At least one lowercase letter required')
    .matches(/\d/, 'At least one number required')
    .matches(/[@$!%*?&#]/, 'At least one special character required')
    .required('Password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),

  terms: Yup.boolean()
    .oneOf([true], 'You must agree to the Terms and Conditions')
    .required('You must agree to the Terms and Conditions'),
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
