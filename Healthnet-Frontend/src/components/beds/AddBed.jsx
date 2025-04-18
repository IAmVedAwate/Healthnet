// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { v4 as uuidv4 } from 'uuid';

// const AddBed = () => {

//   const [bedData, setBedData] = useState({ bedID: new Date().getTime() , ward: "", type: "", status: "" });
//   const navigate = useNavigate();
//   const handleChange = (e) => {
//     setBedData({ ...bedData, [e.target.name]: e.target.value });
//   };

//   const wardOptions = [
//     { id: 1, value: "A", label: "A" },
//     { id: 2, value: "B", label: "B" },
//     { id: 3, value: "C", label: "C" },
//   ];

//   const statusOptions = [
//     { id: 1, value: "Unoccupied", label: "Unoccupied" },
//     { id: 2, value: "Occupied", label: "Occupied" },
//   ];

//   const typeOptions = [
//     { id: 1, value: "ICU", label: "ICU" },
//     { id: 2, value: "General", label: "General" },
//     { id: 3, value: "Personal", label: "Personal" },
//   ];
  
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios
//       .post("http://localhost:5000/api/beds/add", bedData,{
//         headers: {
//           'access-token': token,
//         },
//       })
//       .then(() => alert("Bed added successfully"))
//       .catch((error) => console.error("Error adding bed:", error));
//     navigate("/bed/get");
//   };

//   return (
//     <div className="container mt-4">
//       <div
//     className="card-header rounded-top-4 bg-gradient ml-0 p-3"
//     style={{ backgroundColor: '#a3ffcb' }}
//   >
//     <h1>Create Bed</h1>
//   </div>
//   <div className="card-body shadow p-4">
//       <form className="mx-5" onSubmit={handleSubmit}>
//         <div className="row mb-3">
//           <div className="col">
//             <label className="mb-2">Ward: </label>
//             <select type="text"
//               name="ward"
//               className="form-select"
//               placeholder="Ward"
//               onChange={handleChange}
//               required
//             >
//               <option>select Ward</option>
//               {wardOptions.map((option) => (
//                 <option key={`targetAudienceId${option.id}`} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
            
//           </div>
//           <div className="col">
//             <label className="mb-2">Type: </label>
//             <select type="text"
//               name="type"
//               className="form-select"
//               placeholder="Type"
//               onChange={handleChange}
//               required
//             >
//               <option>select Type</option>
//               {typeOptions.map((option) => (
//                 <option key={`targetAudienceId${option.id}`} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
          
//           </div>
//           <div className="col">
//             <label className="mb-2">Status: </label>
//             <select type="text"
//               name="status"
//               className="form-select"
//               placeholder="Status"
//               onChange={handleChange}
//               required
//             >
//               <option>select Status</option>
//               {statusOptions.map((option) => (
//                 <option key={`targetAudienceId${option.id}`} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//         <button type="submit" className="btn btn-success">Create Bed</button>
//         <Link to={"/bed/get"} className="mx-5 btn btn-outline-success">Go Back</Link>
//       </form>
//       </div>
//     </div>
//   );
// };

// export default AddBed;


import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AddBed = () => {
  const navigate = useNavigate();
  const {token} = useSelector((state) => state.auth)

  const wardOptions = ["A", "B", "C"];
  const typeOptions = ["ICU", "General", "Personal"];
  const statusOptions = ["Unoccupied", "Occupied"];

  const formik = useFormik({
    initialValues: {
      ward: "",
      type: "",
      status: "",
    },
    validationSchema: Yup.object({
      ward: Yup.string().required("Ward is required"),
      type: Yup.string().required("Type is required"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post("http://localhost:5000/api/beds/add", values, {
          headers: {
            "access-token": token,
          },
        });
        alert("Bed added successfully");
        navigate("/bed/get");
      } catch (error) {
        console.error("Error adding bed:", error);
      }
    },
  });

  return (
    <div className="max-w-4xl mx-auto mt-10 px-6">
      <div className="bg-green-200 text-green-900 rounded-t-lg p-4">
        <h1 className="text-2xl font-bold">Create Bed</h1>
      </div>
      <div className="bg-white shadow-lg rounded-b-lg p-6">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ward */}
            <div>
              <label htmlFor="ward" className="block font-semibold mb-1">
                Ward
              </label>
              <select
                id="ward"
                name="ward"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.ward}
                className={`w-full border px-3 py-2 rounded ${
                  formik.touched.ward && formik.errors.ward
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select Ward</option>
                {wardOptions.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              {formik.touched.ward && formik.errors.ward && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.ward}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block font-semibold mb-1">
                Type
              </label>
              <select
                id="type"
                name="type"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.type}
                className={`w-full border px-3 py-2 rounded ${
                  formik.touched.type && formik.errors.type
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select Type</option>
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {formik.touched.type && formik.errors.type && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.type}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block font-semibold mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.status}
                className={`w-full border px-3 py-2 rounded ${
                  formik.touched.status && formik.errors.status
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select Status</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {formik.touched.status && formik.errors.status && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.status}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
            >
              Create Bed
            </button>
            <Link
              to="/bed/get"
              className="text-green-600 border border-green-600 px-5 py-2 rounded hover:bg-green-100 transition"
            >
              Go Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBed;
