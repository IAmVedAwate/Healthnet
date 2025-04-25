import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from 'react-toastify';

const HospitalSignup = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
      contact: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().min(3, "Too short").required("Hospital name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      location: Yup.string().required("Location is required"),
      contact: Yup.string()
        .matches(/^[0-9]{10}$/, "Contact must be 10 digits")
        .required("Contact number is required"),
      password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm, setStatus }) => {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/hospital/signup", values);
        toast.success(res.data.msg)
        setStatus({ success: res.data.msg });
        resetForm();
      } catch (err) {
        const msg = err.response?.data?.msg || "Something went wrong";
        setStatus({ error: msg });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Hospital Signup Request
        </h1>

        {formik.status?.success && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 text-center">
            {formik.status.success}
          </div>
        )}
        {formik.status?.error && (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4 text-center">
            {formik.status.error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Hospital Name"
              className={`w-full px-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"
              }`}
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`w-full px-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <input
              type="text"
              name="location"
              placeholder="Location"
              className={`w-full px-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.location && formik.errors.location ? "border-red-500" : "border-gray-300"
              }`}
              {...formik.getFieldProps("location")}
            />
            {formik.touched.location && formik.errors.location && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.location}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <input
              type="text"
              name="contact"
              placeholder="Contact Number"
              className={`w-full px-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.contact && formik.errors.contact ? "border-red-500" : "border-gray-300"
              }`}
              {...formik.getFieldProps("contact")}
            />
            {formik.touched.contact && formik.errors.contact && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.contact}</p>
            )}
          </div>

          {/* Password + Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={`w-full px-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
                }`}
                {...formik.getFieldProps("password")}
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
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                {...formik.getFieldProps("confirmPassword")}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md shadow transition disabled:opacity-50"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HospitalSignup;
