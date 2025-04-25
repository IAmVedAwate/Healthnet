// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router";

// const AddDoctor = () => {
//   const navigate = useNavigate();
//   const [hospitalId, setHospitalId] = useState(localStorage.getItem("hospitalId"));
//   const [departments, setDepartments] = useState([]);
  
//   // Fetch departments for the hospital.
//   useEffect(() => {
//     if (hospitalId) {
//       axios
//         .get(`http://localhost:5000/api/hospitals/hospital/${hospitalId}`, {
//           headers: { "access-token": token },
//         })
//         .then((response) => setDepartments(response.data))
//         .catch((error) => console.error("Error fetching departments:", error));
//     }
//   }, [hospitalId]);
  
//   // Initialize form data including new authPin
//   const [formData, setFormData] = useState({
//     departmentId: "",
//     firstName: "",
//     lastName: "",
//     email: "",
//     phoneNumber: "",
//     specialization: "",
//     qualification: "",
//     experience: "",
//     hospitalId: "",
//     authPin: ""  // new field for authentication PIN
//   });
  
//   // Update formData with hospitalId.
//   useEffect(() => {
//     if (hospitalId) {
//       setFormData((prev) => ({ ...prev, hospitalId }));
//     }
//   }, [hospitalId]);
  
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Adjust endpoint as needed; here we're assuming POST /api/doctors/add
//       await axios.post("http://localhost:5000/api/doctors/add", formData, {
//         headers: { "access-token": token },
//       });
//       alert("Doctor added successfully");
//       navigate("/doctor/get");
//     } catch (error) {
//       console.error(error);
//       alert("Error adding doctor");
//     }
//   };
  
//   return (
//     <div className="container mt-4">
//       <div className="card-header rounded-top-4 bg-gradient ml-0 p-3" style={{ backgroundColor: "#a3ffcb" }}>
//         <h1>Add Doctor Details</h1>
//       </div>
//       <div className="card-body shadow p-4">
//         <form className="mx-5" onSubmit={handleSubmit}>
//           {/* Department Dropdown */}
//           <div className="mb-3">
//             <label className="form-label">Department</label>
//             <select
//               className="form-select"
//               name="departmentId"
//               value={formData.departmentId}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Department</option>
//               {departments.map((dept) => (
//                 <option key={dept.departmentId} value={dept.departmentId}>
//                   {dept.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           {/* First Name */}
//           <div className="mb-3">
//             <label className="form-label">First Name</label>
//             <input
//               type="text"
//               className="form-control"
//               name="firstName"
//               onChange={handleChange}
//               required
//             />
//           </div>
//           {/* Last Name */}
//           <div className="mb-3">
//             <label className="form-label">Last Name</label>
//             <input
//               type="text"
//               className="form-control"
//               name="lastName"
//               onChange={handleChange}
//               required
//             />
//           </div>
//           {/* Email */}
//           <div className="mb-3">
//             <label className="form-label">Email</label>
//             <input
//               type="email"
//               className="form-control"
//               name="email"
//               onChange={handleChange}
//               required
//             />
//           </div>
//           {/* Phone Number */}
//           <div className="mb-3">
//             <label className="form-label">Phone Number</label>
//             <input
//               type="text"
//               className="form-control"
//               name="phoneNumber"
//               onChange={handleChange}
//               required
//             />
//           </div>
//           {/* Specialization */}
//           <div className="mb-3">
//             <label className="form-label">Specialization</label>
//             <select
//               className="form-select"
//               name="specialization"
//               onChange={handleChange}
//               value={formData.specialization}
//               required
//             >
//               <option value="">Select Specialization</option>
//               <option value="Cardiologist">Cardiologist</option>
//               <option value="Dermatologist">Dermatologist</option>
//               <option value="Neurologist">Neurologist</option>
//               <option value="Pediatrician">Pediatrician</option>
//               <option value="Orthopedic">Orthopedic</option>
//               <option value="General Surgeon">General Surgeon</option>
//               <option value="Psychiatrist">Psychiatrist</option>
//               <option value="Dentist">Dentist</option>
//               <option value="Gynecologist">Gynecologist</option>
//             </select>
//           </div>
//           {/* Qualification */}
//           <div className="mb-3">
//             <label className="form-label">Qualification</label>
//             <input
//               type="text"
//               className="form-control"
//               name="qualification"
//               onChange={handleChange}
//               required
//             />
//           </div>
//           {/* Experience */}
//           <div className="mb-3">
//             <label className="form-label">Experience (years)</label>
//             <input
//               type="number"
//               className="form-control"
//               name="experience"
//               onChange={handleChange}
//               required
//             />
//           </div>
//           {/* Authentication PIN */}
//           <div className="mb-3">
//             <label className="form-label">Authentication PIN</label>
//             <input
//               type="text"
//               className="form-control"
//               name="authPin"
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <button type="submit" className="btn btn-primary">
//             Submit
//           </button>
//           <Link to={"/doctor/get"} className="mx-5 btn btn-outline-primary">
//             Go Back
//           </Link>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddDoctor;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddDoctor = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const {token , id } = useSelector((state) => state.auth)
  const hospitalId = id;

  // Fetch departments
  useEffect(() => {
    if (hospitalId) {
      axios
        .get(`http://localhost:5000/api/hospitals/hospital/${hospitalId}`, {
          headers: { "access-token": token },
        })
        .then((res) => setDepartments(res.data))
        .catch((err) => console.error("Error fetching departments:", err));
    }
    console.log(departments)
  }, [hospitalId]);


  const formik = useFormik({
    initialValues: {
      departmentId: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      specialization: "",
      qualification: "",
      experience: "",
      authPin: "",
    },
    validationSchema: Yup.object({
      departmentId: Yup.string().required("Department is required"),
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phoneNumber: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
      specialization: Yup.string().required("Specialization is required"),
      qualification: Yup.string().required("Qualification is required"),
      experience: Yup.number()
        .min(0, "Experience cannot be negative")
        .required("Experience is required"),
      authPin: Yup.string().required("Authentication PIN is required"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post(
          "http://localhost:5000/api/doctors/add",
          { ...values, hospitalId },
          { headers: { "access-token": token } }
        );
        toast.success("Doctor added successfully");
        navigate("/doctor/get");
      } catch (error) {
        console.error(error);
        alert("Error adding doctor");
      }
    },
  });

  // Dummy departments if no departments are fetched
  const dummyDepartments = [
    { departmentId: "1", name: "Cardiology" },
    { departmentId: "2", name: "Dermatology" },
    { departmentId: "3", name: "Neurology" },
    { departmentId: "4", name: "Pediatrics" },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-semibold mb-6 text-green-600">Add Doctor Details</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {/* Department */}
        <div>
          <label className="block text-sm font-medium">Department</label>
          <select
            name="departmentId"
            value={formik.values.departmentId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Department</option>
            {(departments.length > 0 ? departments : dummyDepartments).map(
              (dept) => (
                <option key={dept.departmentId} value={dept.departmentId}>
                  {dept.name}
                </option>
              )
            )}
          </select>
          {formik.touched.departmentId && formik.errors.departmentId && (
            <p className="text-red-500 text-sm">{formik.errors.departmentId}</p>
          )}
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input
            type="text"
            name="firstName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <p className="text-red-500 text-sm">{formik.errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input
            type="text"
            name="lastName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <p className="text-red-500 text-sm">{formik.errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phoneNumber}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <p className="text-red-500 text-sm">{formik.errors.phoneNumber}</p>
          )}
        </div>

        {/* Specialization */}
        <div>
          <label className="block text-sm font-medium">Specialization</label>
          <select
            name="specialization"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.specialization}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Specialization</option>
            {[
              "Cardiologist",
              "Dermatologist",
              "Neurologist",
              "Pediatrician",
              "Orthopedic",
              "General Surgeon",
              "Psychiatrist",
              "Dentist",
              "Gynecologist",
            ].map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          {formik.touched.specialization && formik.errors.specialization && (
            <p className="text-red-500 text-sm">{formik.errors.specialization}</p>
          )}
        </div>

        {/* Qualification */}
        <div>
          <label className="block text-sm font-medium">Qualification</label>
          <input
            type="text"
            name="qualification"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.qualification}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {formik.touched.qualification && formik.errors.qualification && (
            <p className="text-red-500 text-sm">{formik.errors.qualification}</p>
          )}
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium">Experience (years)</label>
          <input
            type="number"
            name="experience"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.experience}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {formik.touched.experience && formik.errors.experience && (
            <p className="text-red-500 text-sm">{formik.errors.experience}</p>
          )}
        </div>

        {/* Authentication PIN */}
        <div>
          <label className="block text-sm font-medium">Authentication PIN</label>
          <input
            type="text"
            name="authPin"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.authPin}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {formik.touched.authPin && formik.errors.authPin && (
            <p className="text-red-500 text-sm">{formik.errors.authPin}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
          <Link
            to="/doctor/get"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Go Back
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;


