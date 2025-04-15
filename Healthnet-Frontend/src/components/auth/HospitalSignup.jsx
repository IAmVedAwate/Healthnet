import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const HospitalSignup = () => {
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    contact: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(3, "Too short").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    location: Yup.string().required("Required"),
    contact: Yup.string()
      .matches(/^[0-9]{10}$/, "Contact must be 10 digits")
      .required("Required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm, setStatus }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/hospital/signup", values);
      setStatus({ success: response.data.msg });
      resetForm();
    } catch (err) {
      const msg = err.response?.data?.msg || "Something went wrong";
      setStatus({ error: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Hospital Signup Request
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="space-y-5">
              {status?.success && (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded">
                  {status.success}
                </div>
              )}
              {status?.error && (
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded">
                  {status.error}
                </div>
              )}

              <div>
                <label className="block font-medium text-gray-700">Hospital Name</label>
                <Field
                  name="name"
                  type="text"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-sm text-red-600 mt-1"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700">Email</label>
                <Field
                  name="email"
                  type="email"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-600 mt-1"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700">Location</label>
                <Field
                  name="location"
                  type="text"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className="text-sm text-red-600 mt-1"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700">Contact Number</label>
                <Field
                  name="contact"
                  type="text"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="contact"
                  component="div"
                  className="text-sm text-red-600 mt-1"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700">Password</label>
                <Field
                  name="password"
                  type="password"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-600 mt-1"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700">Confirm Password</label>
                <Field
                  name="confirmPassword"
                  type="password"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-sm text-red-600 mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200"
              >
                {isSubmitting ? "Submitting..." : "Submit Signup Request"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default HospitalSignup;
