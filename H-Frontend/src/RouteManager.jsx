import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import ManageRooms from "./components/Hospital/hospital/ManageRooms"
import ManageBeds from "./components/Hospital/hospital/ManageBeds"
import GetAllHospitals from "./components/Hospital/hospital/GetAllHospitals"
import GetHospitalById from "./components/Hospital/hospital/GetHospitalById"
import AdminDashboard from "./components/Admin/AdminDashboard"
import GetAllDoctors from "./components/Hospital/doctor/GetAllDoctors"
import AddDoctor from "./components/Hospital/doctor/AddDoctor"

import GetDoctorById from './components/Hospital/doctor/GetDoctorById';
import UpdateDoctor from './components/Hospital/doctor/UpdateDoctor';
import DeleteDoctor from './components/Hospital/doctor/DeleteDoctor';
import GetAllPatients from './components/Hospital/patient/GetAllPatients';
import AddPatient from './components/Hospital/patient/AddPatient';
import UpdatePatient from './components/Hospital/patient/UpdatePatient';
import GetPatientById from './components/Hospital/patient/GetPatientById';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ResetPassword from './components/Auth/ResetPassword';

import Home from './components/Auth/Home';
import ForgetPassword from './components/Auth/ForgetPassword';
import DoctorSlotManager from './components/Hospital/doctor/DoctorSlotManager';
import HospitalSignup from './components/Auth/HospitalSignup';
import PatientSignup from './components/Auth/PatientSignup';
import DeletePatient from './components/Hospital/patient/DeletePatient';
import { useSelector } from 'react-redux';
import BookAppointment from './components/Hospital/patient/BookAppointment';
import Navigation from './Navigation';




const RouteManager = () => {
  const { role } = useSelector((state) => state.auth);
  return (
    <Router>
      <Navigation />
          <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/room/get" element={<ManageRooms />} />
  <Route path="/room/edit/:roomName/:roomId" element={<ManageBeds />} />
  <Route path="/hospital/get" element={<GetAllHospitals />} />
  <Route path="/hospital/getByid/:hospitalid" element={<GetHospitalById />} />

  {/* Admin routes */}
  {role === "Admin" && (
    <Route path='/admin' element={<AdminDashboard />} />
  )}

  {/* Hospital routes */}
  {role === 'Hospital' && (
    <>
      <Route path="/doctor/get" element={<GetAllDoctors />} />
      <Route path="/doctor/add" element={<AddDoctor />} />
      <Route path="/doctor/update/:doctorid" element={<UpdateDoctor />} />
      <Route path="/doctor/delete" element={<DeleteDoctor />} />
      <Route path="/doctor/getByid/:doctorid" element={<GetDoctorById />} />
      <Route path="/doctor/dashboard/:doctorid" element={<DoctorSlotManager />} />
      <Route path="/patient/get" element={<GetAllPatients />} />
      <Route path="/patient/add" element={<AddPatient />} />
    </>
  )}

  {/* Patient routes */}
  {role === 'Patient' && (
    <>
      <Route path='/patients' element={<Home />} />
      <Route path='/patients/book-appointment' element={<BookAppointment />} />
      <Route path="/patient/get" element={<GetAllPatients />} />
      <Route path="/patient/add" element={<AddPatient />} />
      <Route path="/patient/remove/:id" element={<DeletePatient />} />
      <Route path="/patient/byId/:id" element={<GetPatientById />} />
      <Route path="/patient/edit/:patientid" element={<UpdatePatient />} />
    </>
  )}

  {/* Authentication and signup routes */}
  {!role && (
    <Route path="*" element={<Navigate to="/login" replace />} />
  )}
  <Route path="/login" element={<Login />} />
  <Route path='/signup' element={<Signup />} />
  <Route path="/patient-signup" element={<PatientSignup />} />
  <Route path="/hospital-signup" element={<HospitalSignup />} />
  <Route path="/reset-password" element={<ResetPassword />} />
  <Route path="/forget-password" element={<ForgetPassword />} />
</Routes>

    </Router>
  )
}

export default RouteManager