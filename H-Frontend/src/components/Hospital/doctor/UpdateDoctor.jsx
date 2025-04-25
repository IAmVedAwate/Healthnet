import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useSelector } from "react-redux";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const UpdateDoctor = () => {
  const { doctorid } = useParams();
  const navigate = useNavigate();
  const { id: hospitalId, token } = useSelector((state) => state.auth);

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (hospitalId) {
      axios
        .get(`http://localhost:5000/api/hospitals/hospital/${hospitalId}`, {
          headers: { "access-token": token },
        })
        .then((res) => setDepartments(res.data))
        .catch((err) => console.error("Error fetching departments:", err));
    }
  }, [hospitalId]);

  const [initialValues, setInitialValues] = useState({
    departmentId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    specialization: "",
    qualification: "",
    experience: "",
    authPin: "",
    isActive: 1,
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctors/${doctorid}`, {
          headers: { "access-token": token },
        });
        setInitialValues({
          departmentId: res.data.departmentId || "",
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          email: res.data.email || "",
          phoneNumber: res.data.phoneNumber || "",
          specialization: res.data.specialization || "",
          qualification: res.data.qualification || "",
          experience: res.data.experience || "",
          authPin: res.data.authPin || "",
          isActive: res.data.isActive !== undefined ? res.data.isActive : 1,
        });
      } catch (error) {
        console.error("Error fetching doctor:", error);
      }
    };

    fetchDoctor();
  }, [doctorid, token]);

  const validationSchema = Yup.object({
    departmentId: Yup.string().required("Department is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    specialization: Yup.string().required("Specialization is required"),
    qualification: Yup.string().required("Qualification is required"),
    experience: Yup.number().required("Experience is required").min(0),
    authPin: Yup.string().required("Authentication PIN is required"),
    isActive: Yup.number().oneOf([0, 1], "Invalid status").required(),
  });

  const onSubmit = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/doctors/${doctorid}`, { ...values, hospitalId }, {
        headers: { "access-token": token },
      });
      //alert("Doctor updated successfully");
      toast.success("Doctor updated successfully")
      navigate("/doctor/get");
    } catch (err) {
      console.error("Error updating doctor:", err);
      alert("Error updating doctor");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-emerald-200 to-teal-200 p-4 rounded-t-lg shadow-md mb-4">
        <h2 className="text-2xl font-semibold">Update Doctor Details</h2>
      </div>
      <div className="bg-white p-6 rounded-b-lg shadow-lg">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="space-y-5">
            {/* Department */}
            <div>
              <label className="block mb-1 font-medium">Department</label>
              <Field as="select" name="departmentId" className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="departmentId" component="div" className="text-red-600 text-sm" />
            </div>

            {/* Text fields */}
            {[
              { name: "firstName", label: "First Name" },
              { name: "lastName", label: "Last Name" },
              { name: "email", label: "Email", type: "email" },
              { name: "phoneNumber", label: "Phone Number" },
              { name: "qualification", label: "Qualification" },
              { name: "experience", label: "Experience (years)", type: "number" },
              { name: "authPin", label: "Authentication PIN" },
            ].map(({ name, label, type = "text" }) => (
              <div key={name}>
                <label className="block mb-1 font-medium">{label}</label>
                <Field
                  type={type}
                  name={name}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <ErrorMessage name={name} component="div" className="text-red-600 text-sm" />
              </div>
            ))}

            {/* Specialization */}
            <div>
              <label className="block mb-1 font-medium">Specialization</label>
              <Field as="select" name="specialization" className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">Select Specialization</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Orthopedic">Orthopedic</option>
                <option value="General Surgeon">General Surgeon</option>
                <option value="Psychiatrist">Psychiatrist</option>
                <option value="Dentist">Dentist</option>
                <option value="Gynecologist">Gynecologist</option>
              </Field>
              <ErrorMessage name="specialization" component="div" className="text-red-600 text-sm" />
            </div>

            {/* Active Status */}
            <div>
              <label className="block mb-1 font-medium">Status</label>
              <Field as="select" name="isActive" className="w-full border border-gray-300 rounded px-3 py-2">
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </Field>
            </div>

            <div className="flex gap-4 mt-6">
              <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded shadow">
                Update Doctor
              </button>
              <Link to="/doctor/get" className="text-yellow-600 hover:underline px-5 py-2">
                Cancel
              </Link>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default UpdateDoctor;
